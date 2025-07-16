import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    // Get order details
    const orderResult = await sql`
      SELECT * FROM orders WHERE id = ${orderId}
    `

    if (orderResult.length === 0) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    const order = orderResult[0]

    // Get order items
    const itemsResult = await sql`
      SELECT 
        oi.*,
        p.image_url,
        p.images
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${orderId}
      ORDER BY oi.created_at
    `

    // Get status history
    const historyResult = await sql`
      SELECT * FROM order_status_history 
      WHERE order_id = ${orderId}
      ORDER BY created_at DESC
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

    // Update order
    const updateResult = await sql`
      UPDATE orders 
      SET 
        customer_name = ${body.customer_name || null},
        customer_email = ${body.customer_email || null},
        customer_phone = ${body.customer_phone || null},
        customer_address = ${body.customer_address || null},
        customer_city = ${body.customer_city || null},
        customer_zip = ${body.customer_zip || null},
        customer_landmark = ${body.customer_landmark || null},
        special_instructions = ${body.special_instructions || null},
        status = ${body.status || null},
        updated_at = NOW()
      WHERE id = ${orderId}
      RETURNING *
    `

    if (updateResult.length === 0) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    // Add status history if status changed
    if (body.status) {
      await sql`
        INSERT INTO order_status_history (order_id, status, description)
        VALUES (${orderId}, ${body.status}, ${body.description || `Status changed to ${body.status}`})
      `
    }

    return NextResponse.json({
      success: true,
      data: updateResult[0],
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

    // Delete order items first
    await sql`DELETE FROM order_items WHERE order_id = ${orderId}`

    // Delete status history
    await sql`DELETE FROM order_status_history WHERE order_id = ${orderId}`

    // Delete order
    const deleteResult = await sql`
      DELETE FROM orders WHERE id = ${orderId} RETURNING *
    `

    if (deleteResult.length === 0) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
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
