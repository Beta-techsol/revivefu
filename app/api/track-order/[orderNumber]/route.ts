import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const orderNumber = params.orderNumber

    // Get order details
    const orderResult = await sql`
      SELECT * FROM orders WHERE order_number = ${orderNumber}
    `

    if (orderResult.length === 0) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    const order = orderResult[0]

    // Get order items
    const itemsResult = await sql`
      SELECT * FROM order_items WHERE order_id = ${order.id}
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
        order: {
          ...order,
          items: itemsResult,
          status_history: historyResult,
        },
      },
    })
  } catch (error) {
    console.error("Error tracking order:", error)
    return NextResponse.json({ success: false, error: "Failed to track order" }, { status: 500 })
  }
}
