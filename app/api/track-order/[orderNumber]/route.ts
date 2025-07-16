import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const { orderNumber } = params

    if (!orderNumber) {
      return NextResponse.json(
        {
          success: false,
          error: "Order number is required",
        },
        { status: 400 },
      )
    }

    // Get order details
    const orderResult = await sql`
      SELECT * FROM orders 
      WHERE order_number = ${orderNumber}
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

    // Get order items with product details
    const itemsResult = await sql`
      SELECT 
        oi.*,
        p.image_url,
        p.description,
        p.category
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${order.id}
    `

    // Get order status history
    const statusHistoryResult = await sql`
      SELECT * FROM order_status_history 
      WHERE order_id = ${order.id}
      ORDER BY created_at ASC
    `

    return NextResponse.json({
      success: true,
      data: {
        order: {
          ...order,
          items: itemsResult.map((item) => ({
            ...item,
            image_url: item.image_url || "/placeholder.svg?height=80&width=80&text=Product",
          })),
          status_history: statusHistoryResult,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
