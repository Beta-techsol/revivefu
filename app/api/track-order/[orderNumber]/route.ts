import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const orderNumber = params.orderNumber

    // Get order details
    const orderResult = await sql`
      SELECT * FROM orders WHERE order_number = ${orderNumber}
    `

    if (orderResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found. Please check your order number and try again.",
        },
        { status: 404 },
      )
    }

    const order = orderResult[0]

    // Get order items
    const items = await sql`
      SELECT * FROM order_items WHERE order_id = ${order.id}
    `

    // Get status history
    const statusHistory = await sql`
      SELECT * FROM order_status_history 
      WHERE order_id = ${order.id}
      ORDER BY created_at ASC
    `

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        items,
        status_history: statusHistory,
      },
    })
  } catch (error) {
    console.error("Error tracking order:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to track order. Please try again later.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
