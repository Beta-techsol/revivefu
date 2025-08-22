import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const { orderNumber } = params

    if (!orderNumber) {
      return NextResponse.json({ success: false, error: "Order number is required" }, { status: 400 })
    }

    console.log("Tracking order:", orderNumber)

    // Fetch order
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
        total_amount,
        status,
        payment_status,
        created_at,
        updated_at
      FROM orders 
      WHERE order_number = ${orderNumber}
    `

    if (orderResult.length === 0) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    const order = orderResult[0]

    // Fetch order items with product images
    const itemsResult = await sql`
      SELECT 
        oi.product_name,
        oi.quantity,
        oi.unit_price,
        oi.total_price,
        p.images as product_images
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${order.id}
    `

    // Parse product images
    const processedItems = itemsResult.map((item) => {
      let imageUrl = null

      if (item.product_images) {
        try {
          const images =
            typeof item.product_images === "string"
              ? JSON.parse(item.product_images.replace(/'/g, '"'))
              : item.product_images

          if (Array.isArray(images) && images.length > 0) {
            imageUrl = images[0]
          } else if (typeof images === "string") {
            imageUrl = images
          }
        } catch {
          imageUrl = item.product_images // fallback
        }
      }

      return {
        product_name: item.product_name,
        quantity: Number.parseInt(item.quantity),
        unit_price: Number.parseFloat(item.unit_price),
        total_price: Number.parseFloat(item.total_price),
        product_image: imageUrl,
      }
    })

    // Fetch status history
    const statusHistoryResult = await sql`
      SELECT 
        status,
        description,
        created_at
      FROM order_status_history 
      WHERE order_id = ${order.id}
      ORDER BY created_at ASC
    `

    let statusHistory = []

    if (statusHistoryResult.length > 0) {
      statusHistory = statusHistoryResult.map((item) => ({
        status: item.status,
        timestamp: item.created_at,
        description: item.description || `Order ${item.status}`,
        location: "Revive Furniture",
        created_at: item.created_at,
      }))
    } else {
      // Fallback to generated timeline if no history exists
      const orderDate = new Date(order.created_at)

      statusHistory.push({
        status: "pending",
        timestamp: orderDate.toISOString(),
        description: "Order placed successfully",
        location: "Online Store",
        created_at: orderDate.toISOString(),
      })

      if (["processing", "shipped", "out_for_delivery", "delivered"].includes(order.status)) {
        statusHistory.push({
          status: "processing",
          timestamp: new Date(orderDate.getTime() + 2 * 60 * 60 * 1000).toISOString(),
          description: "Order is being processed",
          location: "Fulfillment Center",
          created_at: new Date(orderDate.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        })
      }

      if (["shipped", "out_for_delivery", "delivered"].includes(order.status)) {
        statusHistory.push({
          status: "shipped",
          timestamp: new Date(orderDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
          description: "Package shipped",
          location: "Distribution Center",
          created_at: new Date(orderDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        })
      }

      if (["out_for_delivery", "delivered"].includes(order.status)) {
        statusHistory.push({
          status: "out_for_delivery",
          timestamp: new Date(orderDate.getTime() + 48 * 60 * 60 * 1000).toISOString(),
          description: "Out for delivery",
          location: "Local Delivery Hub",
          created_at: new Date(orderDate.getTime() + 48 * 60 * 60 * 1000).toISOString(),
        })
      }

      if (order.status === "delivered") {
        statusHistory.push({
          status: "delivered",
          timestamp: new Date(orderDate.getTime() + 72 * 60 * 60 * 1000).toISOString(),
          description: "Package delivered",
          location: "Customer Address",
          created_at: new Date(orderDate.getTime() + 72 * 60 * 60 * 1000).toISOString(),
        })
      }
    }

    // Format total amount in PKR
    const formattedTotal = new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(Number(order.total_amount))

    const trackingData = {
      order_number: order.order_number,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      customer_address: order.customer_address,
      customer_city: order.customer_city,
      customer_zip: order.customer_zip,
      customer_landmark: order.customer_landmark,
      total_amount: formattedTotal,
      status: order.status,
      payment_status: order.payment_status,
      created_at: order.created_at,
      status_history: statusHistory,
      items: processedItems,
    }

    return NextResponse.json({
      success: true,
      data: trackingData,
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
