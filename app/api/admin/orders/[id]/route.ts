import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID is required",
        },
        { status: 400 },
      )
    }

    // Get order details
    const orderResult = await sql`
      SELECT * FROM orders 
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
      SELECT * FROM order_items 
      WHERE order_id = ${order.id}
    `

    // Get status history
    const historyResult = await sql`
      SELECT * FROM order_status_history 
      WHERE order_id = ${order.id} 
      ORDER BY created_at ASC
    `

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        items: itemsResult,
        history: historyResult,
      },
    })
  } catch (error) {
    console.error("Error fetching order:", error)
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

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID is required",
        },
        { status: 400 },
      )
    }

    // Check if this is a status update or full order update
    if (body.status && Object.keys(body).length === 1) {
      // Status update only
      const { status } = body

      // Update order status
      const updateResult = await sql`
        UPDATE orders 
        SET status = ${status}, updated_at = NOW()
        WHERE id = ${orderId}
        RETURNING *
      `

      if (updateResult.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Order not found",
          },
          { status: 404 },
        )
      }

      // Add status history entry
      await sql`
        INSERT INTO order_status_history (order_id, status, description)
        VALUES (${orderId}, ${status}, ${`Order status updated to ${status}`})
      `

      return NextResponse.json({
        success: true,
        data: updateResult[0],
      })
    } else {
      // Full order update
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

      const updateResult = await sql`
        UPDATE orders 
        SET 
          customer_name = ${customer_name},
          customer_email = ${customer_email},
          customer_phone = ${customer_phone},
          customer_address = ${customer_address},
          customer_city = ${customer_city || ""},
          customer_zip = ${customer_zip || ""},
          customer_landmark = ${customer_landmark || ""},
          special_instructions = ${special_instructions || ""},
          status = ${status || "pending"},
          updated_at = NOW()
        WHERE id = ${orderId}
        RETURNING *
      `

      if (updateResult.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Order not found",
          },
          { status: 404 },
        )
      }

      return NextResponse.json({
        success: true,
        data: updateResult[0],
      })
    }
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

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID is required",
        },
        { status: 400 },
      )
    }

    // Delete order items first
    await sql`
      DELETE FROM order_items WHERE order_id = ${orderId}
    `

    // Delete status history
    await sql`
      DELETE FROM order_status_history WHERE order_id = ${orderId}
    `

    // Delete order
    const deleteResult = await sql`
      DELETE FROM orders WHERE id = ${orderId} RETURNING *
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
