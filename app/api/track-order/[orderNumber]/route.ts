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

    // Get order details
    const orderResult = await sql`
      SELECT 
        id,
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
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

    // Get order items
    const itemsResult = await sql`
      SELECT 
        product_name,
        quantity,
        price
      FROM order_items 
      WHERE order_id = ${order.id}
    `

    // Create status history based on current status
    const statusHistory = []
    const orderDate = new Date(order.created_at)

    statusHistory.push({
      status: "pending",
      timestamp: orderDate.toISOString(),
      description: "Order placed successfully",
      location: "Online Store",
    })

    if (["processing", "shipped", "out_for_delivery", "delivered"].includes(order.status)) {
      statusHistory.push({
        status: "processing",
        timestamp: new Date(orderDate.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        description: "Order is being processed",
        location: "Fulfillment Center",
      })
    }

    if (["shipped", "out_for_delivery", "delivered"].includes(order.status)) {
      statusHistory.push({
        status: "shipped",
        timestamp: new Date(orderDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        description: "Package shipped",
        location: "Distribution Center",
      })
    }

    if (["out_for_delivery", "delivered"].includes(order.status)) {
      statusHistory.push({
        status: "out_for_delivery",
        timestamp: new Date(orderDate.getTime() + 48 * 60 * 60 * 1000).toISOString(),
        description: "Out for delivery",
        location: "Local Delivery Hub",
      })
    }

    if (order.status === "delivered") {
      statusHistory.push({
        status: "delivered",
        timestamp: new Date(orderDate.getTime() + 72 * 60 * 60 * 1000).toISOString(),
        description: "Package delivered",
        location: "Customer Address",
      })
    }

    const trackingData = {
      orderNumber: order.order_number,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      shippingAddress: order.shipping_address,
      totalAmount: Number.parseFloat(order.total_amount),
      status: order.status,
      paymentStatus: order.payment_status,
      createdAt: order.created_at,
      statusHistory,
      items: itemsResult.map((item) => ({
        product_name: item.product_name,
        quantity: Number.parseInt(item.quantity),
        price: Number.parseFloat(item.price),
      })),
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
