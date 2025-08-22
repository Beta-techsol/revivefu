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

    const itemsResult = await sql`
      SELECT 
        product_name,
        quantity,
        unit_price,
        total_price
      FROM order_items 
      WHERE order_id = ${order.id}
    `

    const statusHistoryResult = await sql`
      SELECT 
        status,
        description,
        created_at
      FROM order_status_history 
      WHERE order_id = ${order.id}
      ORDER BY created_at ASC
    `

    // Create status history - use real data if available, otherwise create based on current status
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
      // Fallback to creating status history based on current status
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

    const trackingData = {
      order_number: order.order_number,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      customer_address: order.customer_address,
      customer_city: order.customer_city,
      customer_zip: order.customer_zip,
      customer_landmark: order.customer_landmark,
      total_amount: Number.parseFloat(order.total_amount),
      status: order.status,
      payment_status: order.payment_status,
      created_at: order.created_at,
      status_history: statusHistory,
      items: itemsResult.map((item) => ({
        product_name: item.product_name,
        quantity: Number.parseInt(item.quantity),
        unit_price: Number.parseFloat(item.unit_price),
        total_price: Number.parseFloat(item.total_price),
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
