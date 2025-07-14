import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// Middleware to verify admin authentication
async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    throw new Error("No authentication token")
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
  return decoded
}

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request)

    // Get total revenue
    const revenueResult = await sql`
      SELECT COALESCE(SUM(total_amount), 0) as total_revenue
      FROM orders 
      WHERE payment_status = 'paid'
    `

    // Get total orders
    const ordersResult = await sql`
      SELECT COUNT(*) as total_orders
      FROM orders
    `

    // Get total products
    const productsResult = await sql`
      SELECT COUNT(*) as total_products
      FROM products
    `

    // Get total customers
    const customersResult = await sql`
      SELECT COUNT(*) as total_customers
      FROM customers
    `

    // Get recent orders
    const recentOrders = await sql`
      SELECT id, order_number, customer_name, total_amount, status, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5
    `

    // Get monthly revenue for the last 6 months
    const monthlyRevenue = await sql`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        SUM(total_amount) as revenue
      FROM orders
      WHERE payment_status = 'paid' 
        AND created_at >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
    `

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue: Number.parseFloat(revenueResult[0].total_revenue),
        totalOrders: Number.parseInt(ordersResult[0].total_orders),
        totalProducts: Number.parseInt(productsResult[0].total_products),
        totalCustomers: Number.parseInt(customersResult[0].total_customers),
      },
      recentOrders,
      monthlyRevenue,
    })
  } catch (error) {
    console.error("Get stats error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch statistics" }, { status: 500 })
  }
}
