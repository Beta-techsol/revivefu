import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id
    console.log("Fetching order details for ID:", orderId)

    // Get order details
    const orderResult = await sql`
      SELECT 
        id,
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        customer_city,
        customer_zip,
        customer_landmark,
        special_instructions,
        subtotal,
        delivery_charge,
        total_amount,
        status,
        payment_method,
        created_at,
        updated_at
      FROM orders 
      WHERE id = ${orderId}
    `

    if (orderResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      )
    }

    const order = orderResult[0]

    // Get order items
    const itemsResult = await sql`
      SELECT 
        oi.*,
        p.name as product_name,
        p.image_url as product_image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${orderId}
      ORDER BY oi.created_at
    `

    // Get status history
    const statusHistoryResult = await sql`
      SELECT 
        id,
        status,
        description,
        created_at
      FROM order_status_history
      WHERE order_id = ${orderId}
      ORDER BY created_at DESC
    `

    const response = NextResponse.json({
      success: true,
      data: {
        ...order,
        items: itemsResult,
        history: statusHistoryResult,
      },
    })

    // Add cache control headers
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")

    return response
  } catch (error) {
    console.error("Error fetching order details:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id
    const body = await request.json()
    console.log("Updating order:", orderId, "with data:", body)

    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      customer_city,
      customer_zip,
      customer_landmark,
      special_instructions,
      status,
    } = body

    // Get current order to check if status changed
    const currentOrderResult = await sql`
      SELECT status FROM orders WHERE id = ${orderId}
    `

    if (currentOrderResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      )
    }

    const currentStatus = currentOrderResult[0].status

    // Update the order
    const updateResult = await sql`
      UPDATE orders 
      SET 
        customer_name = ${customer_name},
        customer_email = ${customer_email},
        customer_phone = ${customer_phone},
        customer_address = ${customer_address},
        customer_city = ${customer_city},
        customer_zip = ${customer_zip},
        customer_landmark = ${customer_landmark || null},
        special_instructions = ${special_instructions || null},
        status = ${status},
        updated_at = NOW()
      WHERE id = ${orderId}
      RETURNING *
    `

    if (updateResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update order",
        },
        { status: 500 },
      )
    }

    const updatedOrder = updateResult[0]
    console.log("Order updated successfully:", updatedOrder)

    // Add status history if status changed
    if (status && status !== currentStatus) {
      try {
        await sql`
          INSERT INTO order_status_history (order_id, status, description, created_at)
          VALUES (${orderId}, ${status}, ${"Status updated by admin"}, NOW())
        `
        console.log("Status history added for status change:", currentStatus, "->", status)
      } catch (historyError) {
        console.error("Error adding status history:", historyError)
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: "Order updated successfully",
    })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id
    console.log("Deleting order:", orderId)

    // First delete order items
    await sql`DELETE FROM order_items WHERE order_id = ${orderId}`

    // Delete status history
    await sql`DELETE FROM order_status_history WHERE order_id = ${orderId}`

    // Finally delete the order
    const deleteResult = await sql`
      DELETE FROM orders 
      WHERE id = ${orderId}
      RETURNING *
    `

    if (deleteResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      )
    }

    console.log("Order deleted successfully:", deleteResult[0])

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting order:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
