import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const { orderNumber } = params

    if (!orderNumber) {
      return NextResponse.json({ success: false, error: "Order number is required" }, { status: 400 })
    }

    // Get order details
    const orderQuery = `
      SELECT * FROM orders 
      WHERE order_number = $1
    `

    const orderResult = await sql(orderQuery, [orderNumber])

    if (orderResult.length === 0) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    const order = orderResult[0]

    // Get order items with product details
    const itemsQuery = `
      SELECT 
        oi.*,
        p.name as product_name,
        p.price as product_price,
        p.image_url as product_image,
        p.description as product_description
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
      ORDER BY oi.id
    `

    const items = await sql(itemsQuery, [order.id])

    // Get order status history
    const statusHistoryQuery = `
      SELECT * FROM order_status_history 
      WHERE order_id = $1 
      ORDER BY created_at ASC
    `

    const statusHistory = await sql(statusHistoryQuery, [order.id])

    // Create tracking timeline
    const timeline = [
      {
        status: "pending",
        title: "Order Placed",
        description: "Your order has been received and is being processed",
        date: order.created_at,
        completed: true,
      },
      {
        status: "processing",
        title: "Processing",
        description: "We are preparing your order",
        date: statusHistory.find((h) => h.status === "processing")?.created_at || null,
        completed: ["processing", "shipped", "delivered"].includes(order.status),
      },
      {
        status: "shipped",
        title: "Shipped",
        description: "Your order is on its way",
        date: statusHistory.find((h) => h.status === "shipped")?.created_at || null,
        completed: ["shipped", "delivered"].includes(order.status),
      },
      {
        status: "delivered",
        title: "Delivered",
        description: "Your order has been delivered",
        date: statusHistory.find((h) => h.status === "delivered")?.created_at || null,
        completed: order.status === "delivered",
      },
    ]

    return NextResponse.json({
      success: true,
      data: {
        order: {
          ...order,
          items: items.map((item) => ({
            ...item,
            // Ensure product image is properly formatted
            product_image: item.product_image || "/placeholder.svg?height=100&width=100&text=Product",
          })),
        },
        timeline,
      },
    })
  } catch (error) {
    console.error("Error tracking order:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to track order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
