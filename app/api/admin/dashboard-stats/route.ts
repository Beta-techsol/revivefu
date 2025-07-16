import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching dashboard stats...")

    // Get total revenue from orders
    const revenueResult = await sql`
      SELECT 
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COUNT(*) as total_orders
      FROM orders 
      WHERE payment_status = 'paid'
    `

    // Get total orders count
    const ordersResult = await sql`
      SELECT COUNT(*) as total_orders
      FROM orders
    `

    // Get total products sold (sum of quantities from order_items)
    const productsResult = await sql`
      SELECT COALESCE(SUM(oi.quantity), 0) as total_products_sold
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
    `

    // Get active users count (customers who have placed orders)
    const usersResult = await sql`
      SELECT COUNT(DISTINCT customer_email) as active_users
      FROM orders
    `

    // Get recent orders (last 5)
    const recentOrdersResult = await sql`
      SELECT 
        id,
        order_number,
        customer_name,
        total_amount,
        status,
        created_at
      FROM orders 
      ORDER BY created_at DESC 
      LIMIT 5
    `

    // Calculate percentage changes (mock data for now - you can implement proper historical comparison)
    const stats = {
      totalRevenue: {
        value: Number(revenueResult[0]?.total_revenue) || 0,
        change: "+20.1%", // You can calculate this based on previous period
        trend: "up",
      },
      totalOrders: {
        value: Number(ordersResult[0]?.total_orders) || 0,
        change: "+15.3%",
        trend: "up",
      },
      totalProductsSold: {
        value: Number(productsResult[0]?.total_products_sold) || 0,
        change: "+8.7%",
        trend: "up",
      },
      activeUsers: {
        value: Number(usersResult[0]?.active_users) || 0,
        change: "+12.5%",
        trend: "up",
      },
      recentOrders: recentOrdersResult,
    }

    console.log("Dashboard stats:", stats)

    const response = NextResponse.json({
      success: true,
      data: stats,
    })

    // Add cache control headers
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")

    return response
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard stats",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
