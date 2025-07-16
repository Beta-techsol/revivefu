import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log(`=== GET ORDER ${id} API CALLED ===`)

    // Force fresh database queries
    const timestamp = Date.now()

    // Get fresh order details
    const orderResult = await sql`
      SELECT * FROM orders WHERE id = ${id}
    `

    if (orderResult.length === 0) {
      const notFoundResponse = NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
      notFoundResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
      return notFoundResponse
    }

    const order = orderResult[0]
    console.log(`Found order: ${order.order_number}, status: ${order.status}`)

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

    console.log(`Order items: ${itemsResult.length}, History entries: ${historyResult.length}`)

    const response = NextResponse.json({
      success: true,
      data: {
        ...order,
        items: itemsResult,
        history: historyResult,
        timestamp: new Date().toISOString(),
      },
    })

    // Aggressive no-cache headers
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    response.headers.set("Last-Modified", new Date().toUTCString())
    response.headers.set("ETag", `"${timestamp}-${Math.random()}"`)

    console.log(`=== GET ORDER ${id} RESPONSE SENT ===`)
    return response
  } catch (error) {
    console.error(`=== GET ORDER ${params.id} ERROR ===`, error)
    const errorResponse = NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
    errorResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
    return errorResponse
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    console.log(`=== UPDATE ORDER ${id} API CALLED ===`)
    console.log("Update data:", body)

    // Check if order exists with fresh query
    const existingOrderResult = await sql`
      SELECT * FROM orders WHERE id = ${id}
    `

    if (existingOrderResult.length === 0) {
      const notFoundResponse = NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
      notFoundResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
      return notFoundResponse
    }

    const existingOrder = existingOrderResult[0]
    console.log(`Existing order status: ${existingOrder.status}`)

    // Handle status-only updates
    if (body.status && Object.keys(body).length === 1) {
      console.log(`Updating status from ${existingOrder.status} to ${body.status}`)

      const updatedOrderResult = await sql`
        UPDATE orders 
        SET status = ${body.status}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `

      if (updatedOrderResult.length > 0) {
        console.log("Status updated in database")

        // Add to status history
        try {
          await sql`
            INSERT INTO order_status_history (order_id, status, description, created_at)
            VALUES (${id}, ${body.status}, ${"Status updated by admin"}, NOW())
          `
          console.log("Status history added")
        } catch (historyError) {
          console.error("Error adding status history:", historyError)
        }

        const response = NextResponse.json({
          success: true,
          data: updatedOrderResult[0],
          timestamp: new Date().toISOString(),
        })

        // Force no-cache for updates
        response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0")
        response.headers.set("Pragma", "no-cache")
        response.headers.set("Expires", "0")
        response.headers.set("Last-Modified", new Date().toUTCString())

        console.log(`=== UPDATE ORDER ${id} STATUS SUCCESS ===`)
        return response
      }
    }

    // Handle full order updates
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

    console.log("Performing full order update")

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

      const response = NextResponse.json({
        success: true,
        data: updatedOrderResult[0],
        timestamp: new Date().toISOString(),
      })

      // Force no-cache for updates
      response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0")
      response.headers.set("Pragma", "no-cache")
      response.headers.set("Expires", "0")
      response.headers.set("Last-Modified", new Date().toUTCString())

      console.log(`=== UPDATE ORDER ${id} FULL SUCCESS ===`)
      return response
    }

    const failResponse = NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 })
    failResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
    return failResponse
  } catch (error) {
    console.error(`=== UPDATE ORDER ${params.id} ERROR ===`, error)
    const errorResponse = NextResponse.json(
      {
        success: false,
        error: "Failed to update order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
    errorResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
    return errorResponse
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log(`=== DELETE ORDER ${id} API CALLED ===`)

    // Delete order items first (foreign key constraint)
    await sql`DELETE FROM order_items WHERE order_id = ${id}`
    console.log("Order items deleted")

    // Delete status history
    await sql`DELETE FROM order_status_history WHERE order_id = ${id}`
    console.log("Status history deleted")

    // Delete the order
    const deletedOrderResult = await sql`
      DELETE FROM orders WHERE id = ${id} RETURNING *
    `

    if (deletedOrderResult.length > 0) {
      console.log("Order deleted successfully")

      const response = NextResponse.json({
        success: true,
        data: deletedOrderResult[0],
        timestamp: new Date().toISOString(),
      })

      // Force no-cache for deletes
      response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0")
      response.headers.set("Pragma", "no-cache")
      response.headers.set("Expires", "0")
      response.headers.set("Last-Modified", new Date().toUTCString())

      console.log(`=== DELETE ORDER ${id} SUCCESS ===`)
      return response
    }

    const notFoundResponse = NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    notFoundResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
    return notFoundResponse
  } catch (error) {
    console.error(`=== DELETE ORDER ${params.id} ERROR ===`, error)
    const errorResponse = NextResponse.json(
      {
        success: false,
        error: "Failed to delete order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
    errorResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
    return errorResponse
  }
}
