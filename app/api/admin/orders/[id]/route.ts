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

    // Get order items
    const itemsResult = await sql`
      SELECT * FROM order_items WHERE order_id = ${orderId}
    `

    // Get status history
    const historyResult = await sql`
      SELECT * FROM order_status_history 
      WHERE order_id = ${orderId} 
      ORDER BY created_at ASC
    `

    const order = {
      ...orderResult[0],
      items: itemsResult,
      status_history: historyResult,
    }

    return NextResponse.json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id
    const body = await request.json()

    // Check if it's a status update
    if (body.status) {
      const oldOrder = await sql`SELECT status FROM orders WHERE id = ${orderId}`
      const oldStatus = oldOrder[0]?.status

      // Update order status
      await sql`
        UPDATE orders 
        SET status = ${body.status}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${orderId}
      `

      // Add to status history if status changed
      if (oldStatus !== body.status) {
        await sql`
          INSERT INTO order_status_history (order_id, status, description)
          VALUES (${orderId}, ${body.status}, ${`Status changed from ${oldStatus} to ${body.status}`})
        `
      }
    } else {
      // Update other order fields
      const { customer_name, customer_email, customer_phone, customer_address, customer_city, customer_zip } = body

      await sql`
        UPDATE orders 
        SET 
          customer_name = ${customer_name},
          customer_email = ${customer_email},
          customer_phone = ${customer_phone},
          customer_address = ${customer_address},
          customer_city = ${customer_city},
          customer_zip = ${customer_zip},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${orderId}
      `
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
    })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    // Delete order (cascade will handle order_items and order_status_history)
    await sql`DELETE FROM orders WHERE id = ${orderId}`

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting order:", error)
    return NextResponse.json({ success: false, error: "Failed to delete order" }, { status: 500 })
  }
}
