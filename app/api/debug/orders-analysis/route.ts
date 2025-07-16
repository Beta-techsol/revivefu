import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    console.log("=== DEBUG: Orders Analysis ===")

    // Check orders table structure
    const ordersColumnsResult = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orders' 
      ORDER BY column_name
    `

    // Check products table structure
    const productsColumnsResult = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      ORDER BY column_name
    `

    // Check order_items table structure
    const orderItemsColumnsResult = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'order_items' 
      ORDER BY column_name
    `

    // Get sample orders data
    const ordersResult = await sql`
      SELECT 
        id,
        order_number,
        total_amount,
        status,
        created_at
      FROM orders 
      ORDER BY created_at DESC 
      LIMIT 5
    `

    // Get sample order items data with only existing columns
    const orderItemsResult = await sql`
      SELECT 
        oi.id,
        oi.order_id,
        oi.product_id,
        oi.quantity,
        oi.created_at
      FROM order_items oi
      LIMIT 10
    `

    // Get sample products data
    const productsResult = await sql`
      SELECT 
        id,
        name,
        sku,
        price,
        images
      FROM products 
      LIMIT 5
    `

    // Analyze data issues
    const issues = []
    const dataAnalysis = {
      totalOrders: ordersResult.length,
      ordersWithInvalidAmounts: 0,
      ordersWithMissingData: 0,
    }

    ordersResult.forEach((order) => {
      if (isNaN(Number.parseFloat(order.total_amount))) {
        dataAnalysis.ordersWithInvalidAmounts++
        issues.push(`Order ${order.id} has invalid total_amount: ${order.total_amount}`)
      }
      if (!order.order_number) {
        dataAnalysis.ordersWithMissingData++
        issues.push(`Order ${order.id} missing order_number`)
      }
    })

    return NextResponse.json({
      success: true,
      analysis: {
        tableStructures: {
          orders: ordersColumnsResult,
          products: productsColumnsResult,
          order_items: orderItemsColumnsResult,
        },
        sampleData: {
          orders: ordersResult,
          orderItems: orderItemsResult,
          products: productsResult,
        },
        dataAnalysis,
        issues,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Debug orders analysis error:", error)
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
