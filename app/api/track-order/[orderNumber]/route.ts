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

    // Get order items with product details
    const itemsResult = await sql`
      SELECT 
        oi.*,
        p.image_url,
        p.images,
        p.name as product_name_from_db
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${order.id}
      ORDER BY oi.created_at
    `

    // Process items to ensure proper image URLs
    const processedItems = itemsResult.map((item) => {
      let imageUrl = null

      // Try to get image from product table
      if (item.image_url) {
        imageUrl = item.image_url
      } else if (item.images) {
        try {
          const images = typeof item.images === "string" ? JSON.parse(item.images) : item.images
          if (Array.isArray(images) && images.length > 0) {
            imageUrl = images[0]
          }
        } catch (e) {
          console.error("Error parsing images:", e)
        }
      }

      // Fallback to placeholder if no image found
      if (!imageUrl) {
        imageUrl = "/placeholder.svg?height=100&width=100&text=Product"
      }

      return {
        ...item,
        image_url: imageUrl,
        product_name: item.product_name || item.product_name_from_db || "Unknown Product",
      }
    })

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
        items: processedItems,
        history: historyResult,
      },
    })
  } catch (error) {
    console.error("Error fetching order tracking:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order tracking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
