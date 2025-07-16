import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id
    console.log('=== DEBUG: Order Detail Analysis for ID:", orderId ===')

    // Test if order exists
    const orderExists = await sql`
      SELECT COUNT(*) as count FROM orders WHERE id = ${orderId}
    `
    console.log("Order exists check:", orderExists[0])

    if (orderExists[0].count === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
          orderId,
          debug: {
            orderExists: false,
          },
        },
        { status: 404 },
      )
    }

    // Get order details with all fields
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
        special_instructions,
        subtotal,
        delivery_charge,
        total_amount,
        status,
        payment_method,
        created_at,
        updated_at
      FROM orders 
      WHERE id = ${orderId}
    `

    console.log("Order query result:", orderResult)

    if (orderResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found in detailed query",
          orderId,
        },
        { status: 404 },
      )
    }

    const order = orderResult[0]

    // Get order items
    const itemsResult = await sql`
      SELECT 
        oi.id,
        oi.product_id,
        oi.quantity,
        oi.price,
        oi.created_at,
        p.name as product_name,
        p.sku as product_sku,
        p.image_url as product_image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${orderId}
      ORDER BY oi.created_at
    `

    console.log("Order items result:", itemsResult)

    // Get status history
    const statusHistoryResult = await sql`
      SELECT 
        id,
        status,
        description,
        created_at
      FROM order_status_history
      WHERE order_id = ${orderId}
      ORDER BY created_at DESC
    `

    console.log("Status history result:", statusHistoryResult)

    // Analyze the data
    const analysis = {
      orderId,
      orderFound: true,
      orderData: order,
      itemsCount: itemsResult.length,
      itemsData: itemsResult,
      statusHistoryCount: statusHistoryResult.length,
      statusHistoryData: statusHistoryResult,
      dataTypes: {
        total_amount: {
          type: typeof order.total_amount,
          value: order.total_amount,
          isNumber: !isNaN(Number.parseFloat(order.total_amount)),
          parsed: Number.parseFloat(order.total_amount),
        },
        subtotal: {
          type: typeof order.subtotal,
          value: order.subtotal,
          isNumber: !isNaN(Number.parseFloat(order.subtotal)),
          parsed: Number.parseFloat(order.subtotal),
        },
      },
      issues: [],
    }

    // Check for data issues
    if (isNaN(Number.parseFloat(order.total_amount))) {
      analysis.issues.push("Invalid total_amount")
    }
    if (!order.customer_email) {
      analysis.issues.push("Missing customer_email")
    }
    if (itemsResult.length === 0) {
      analysis.issues.push("No order items found")
    }

    return NextResponse.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Debug order detail error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        orderId: params.id,
      },
      { status: 500 },
    )
  }
}
