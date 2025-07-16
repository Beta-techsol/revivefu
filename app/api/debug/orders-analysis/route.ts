import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    console.log("=== DEBUG: Starting orders analysis ===")

    // Test database connection
    const connectionTest = await sql`SELECT NOW() as current_time`
    console.log("Database connection:", connectionTest[0])

    // Get all orders with detailed info
    const ordersResult = await sql`
      SELECT 
        o.id,
        o.order_number,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.customer_address,
        o.customer_city,
        o.customer_zip,
        o.customer_landmark,
        o.special_instructions,
        o.subtotal,
        o.delivery_charge,
        o.total_amount,
        o.status,
        o.payment_method,
        o.created_at,
        o.updated_at,
        COALESCE(COUNT(oi.id), 0) as item_count,
        COALESCE(SUM(oi.quantity), 0) as total_items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id, o.order_number, o.customer_name, o.customer_email, 
               o.customer_phone, o.customer_address, o.customer_city, 
               o.customer_zip, o.customer_landmark, o.special_instructions,
               o.subtotal, o.delivery_charge, o.total_amount, o.status, 
               o.payment_method, o.created_at, o.updated_at
      ORDER BY o.created_at DESC
      LIMIT 10
    `

    console.log("Orders found:", ordersResult.length)
    console.log("Sample order data:", ordersResult[0])

    // Check order items for a specific order
    if (ordersResult.length > 0) {
      const firstOrderId = ordersResult[0].id
      const itemsResult = await sql`
        SELECT 
          oi.*,
          p.name as product_name,
          p.image_url as product_image
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ${firstOrderId}
      `
      console.log("Order items for first order:", itemsResult)
    }

    // Analyze data types and values
    const analysis = {
      totalOrders: ordersResult.length,
      sampleOrder: ordersResult[0] || null,
      dataTypes: {},
      calculations: {},
      issues: [],
    }

    if (ordersResult.length > 0) {
      const sampleOrder = ordersResult[0]

      // Check data types
      analysis.dataTypes = {
        total_amount_type: typeof sampleOrder.total_amount,
        total_amount_value: sampleOrder.total_amount,
        subtotal_type: typeof sampleOrder.subtotal,
        subtotal_value: sampleOrder.subtotal,
        delivery_charge_type: typeof sampleOrder.delivery_charge,
        delivery_charge_value: sampleOrder.delivery_charge,
        item_count_type: typeof sampleOrder.item_count,
        item_count_value: sampleOrder.item_count,
      }

      // Test calculations
      const totalRevenue = ordersResult.reduce((sum, order) => {
        const amount = Number.parseFloat(order.total_amount) || 0
        return sum + amount
      }, 0)

      const avgOrderValue = ordersResult.length > 0 ? totalRevenue / ordersResult.length : 0

      analysis.calculations = {
        totalRevenue,
        avgOrderValue,
        orderCount: ordersResult.length,
        revenuePerOrder: ordersResult.map((o) => ({
          id: o.id,
          amount: o.total_amount,
          parsed: Number.parseFloat(o.total_amount) || 0,
        })),
      }

      // Check for issues
      ordersResult.forEach((order) => {
        if (isNaN(Number.parseFloat(order.total_amount))) {
          analysis.issues.push(`Order ${order.id} has invalid total_amount: ${order.total_amount}`)
        }
        if (!order.customer_email) {
          analysis.issues.push(`Order ${order.id} missing customer_email`)
        }
      })
    }

    return NextResponse.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Debug analysis error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
