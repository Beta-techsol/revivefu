import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Get all orders with basic info
    const orders = await sql`
      SELECT 
        id,
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        customer_city,
        customer_zip,
        total_amount,
        status,
        payment_method,
        created_at,
        updated_at
      FROM orders 
      ORDER BY created_at DESC
    `

    // Get item counts for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        try {
          const itemsResult = await sql`
            SELECT COUNT(*) as item_count, COALESCE(SUM(quantity), 0) as total_items
            FROM order_items 
            WHERE order_id = ${order.id}
          `
          return {
            ...order,
            item_count: Number.parseInt(itemsResult[0]?.item_count) || 0,
            total_items: Number.parseInt(itemsResult[0]?.total_items) || 0,
          }
        } catch (error) {
          console.error(`Error getting items for order ${order.id}:`, error)
          return {
            ...order,
            item_count: 0,
            total_items: 0,
          }
        }
      }),
    )

    return NextResponse.json({
      success: true,
      data: {
        orders: ordersWithItems,
        pagination: {
          page: 1,
          limit: ordersWithItems.length,
          total: ordersWithItems.length,
          pages: 1,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
