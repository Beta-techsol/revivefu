import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log(`Fetching fresh order data for ID: ${id}`)

    // Get fresh order details - mirroring products API pattern
    const orderResult = await sql`
      SELECT * FROM orders WHERE id = ${id}
    `

    if (orderResult.length === 0) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    const order = orderResult[0]

    // Get fresh order items
    const itemsResult = await sql`
      SELECT * FROM order_items WHERE order_id = ${id}
    `

    // Get fresh status history
    const historyResult = await sql`
      SELECT * FROM order_status_history 
      WHERE order_id = ${id} 
      ORDER BY created_at ASC
    `

    // Process data similar to products API
    const processedOrder = {
      ...order,
      items: itemsResult,
      status_history: historyResult,
    }

    const response = NextResponse.json({
      success: true,
      data: processedOrder,
      timestamp: new Date().toISOString(),
    })

    // Set aggressive cache-busting headers - mirroring products API
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    response.headers.set("Last-Modified", new Date().toUTCString())
    response.headers.set("ETag", `"${Date.now()}-${id}"`)

    return response
  } catch (error) {
    console.error("Error fetching order:", error)

    const errorResponse = NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )

    errorResponse.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
    errorResponse.headers.set("Pragma", "no-cache")
    errorResponse.headers.set("Expires", "0")

    return errorResponse
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    console.log(`Updating order ${id} with fresh data:`, body)

    // Check if order exists first - mirroring products API pattern
    const existingOrderResult = await sql`
      SELECT * FROM orders WHERE id = ${id}
    `

    if (existingOrderResult.length === 0) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    const existingOrder = existingOrderResult[0]

    // Handle status-only updates with immediate database write
    if (body.status && Object.keys(body).length === 1) {
      console.log(`Performing immediate status update to: ${body.status}`)

      const updatedOrderResult = await sql`
        UPDATE orders 
        SET 
          status = ${body.status}, 
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `

      if (updatedOrderResult.length > 0) {
        // Add to status history immediately
        try {
          await sql`
            INSERT INTO order_status_history (order_id, status, description, created_at)
            VALUES (${id}, ${body.status}, ${"Status updated by admin"}, NOW())
          `
        } catch (historyError) {
          console.error("Error adding status history:", historyError)
        }

        console.log("Status updated successfully in database")

        const response = NextResponse.json({
          success: true,
          data: updatedOrderResult[0],
          timestamp: new Date().toISOString(),
        })

        // Set aggressive cache-busting headers
        response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
        response.headers.set("Pragma", "no-cache")
        response.headers.set("Expires", "0")
        response.headers.set("Last-Modified", new Date().toUTCString())
        response.headers.set("ETag", `"${Date.now()}-${id}-updated"`)

        return response
      }
    }

    // Handle full order updates - mirroring products API pattern
    const {
      customer_name = existingOrder.customer_name,
      customer_email = existingOrder.customer_email,
      customer_phone = existingOrder.customer_phone,
      customer_address = existingOrder.customer_address,
      customer_city = existingOrder.customer_city,
      customer_zip = existingOrder.customer_zip,
      customer_landmark = existingOrder.customer_landmark,
      special_instructions = existingOrder.special_instructions,
      status = existingOrder.status,
    } = body

    console.log("Performing full order update in database")

    const updatedOrderResult = await sql`
      UPDATE orders 
      SET 
        customer_name = ${customer_name},
        customer_email = ${customer_email},
        customer_phone = ${customer_phone},
        customer_address = ${customer_address},
        customer_city = ${customer_city},
        customer_zip = ${customer_zip},
        customer_landmark = ${customer_landmark},
        special_instructions = ${special_instructions},
        status = ${status},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (updatedOrderResult.length > 0) {
      // Add to status history if status changed
      if (status !== existingOrder.status) {
        try {
          await sql`
            INSERT INTO order_status_history (order_id, status, description, created_at)
            VALUES (${id}, ${status}, ${"Order updated by admin"}, NOW())
          `
        } catch (historyError) {
          console.error("Error adding status history:", historyError)
        }
      }

      console.log("Order updated successfully in database")

      const response = NextResponse.json({
        success: true,
        data: updatedOrderResult[0],
        timestamp: new Date().toISOString(),
      })

      // Set aggressive cache-busting headers
      response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
      response.headers.set("Pragma", "no-cache")
      response.headers.set("Expires", "0")
      response.headers.set("Last-Modified", new Date().toUTCString())
      response.headers.set("ETag", `"${Date.now()}-${id}-updated"`)

      return response
    }

    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 })
  } catch (error) {
    console.error("Error updating order:", error)

    const errorResponse = NextResponse.json(
      {
        success: false,
        error: "Failed to update order",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )

    errorResponse.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
    errorResponse.headers.set("Pragma", "no-cache")
    errorResponse.headers.set("Expires", "0")

    return errorResponse
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log(`Deleting order ${id} from database`)

    // Delete order items first (foreign key constraint) - mirroring products API pattern
    await sql`DELETE FROM order_items WHERE order_id = ${id}`

    // Delete status history
    await sql`DELETE FROM order_status_history WHERE order_id = ${id}`

    // Delete the order
    const deletedOrderResult = await sql`
      DELETE FROM orders 
      WHERE id = ${id} 
      RETURNING *
    `

    if (deletedOrderResult.length > 0) {
      console.log("Order deleted successfully from database")

      const response = NextResponse.json({
        success: true,
        data: deletedOrderResult[0],
        timestamp: new Date().toISOString(),
      })

      // Set aggressive cache-busting headers
      response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
      response.headers.set("Pragma", "no-cache")
      response.headers.set("Expires", "0")
      response.headers.set("Last-Modified", new Date().toUTCString())
      response.headers.set("ETag", `"${Date.now()}-${id}-deleted"`)

      return response
    }

    return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
  } catch (error) {
    console.error("Error deleting order:", error)

    const errorResponse = NextResponse.json(
      {
        success: false,
        error: "Failed to delete order",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )

    errorResponse.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
    errorResponse.headers.set("Pragma", "no-cache")
    errorResponse.headers.set("Expires", "0")

    return errorResponse
  }
}
