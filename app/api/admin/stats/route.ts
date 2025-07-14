import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { sql } from "@/lib/db"

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
      WHERE status = 'active'
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

    const stats = {
      totalRevenue: Number(revenueResult[0].total_revenue),
      totalOrders: Number(ordersResult[0].total_orders),
      totalProducts: Number(productsResult[0].total_products),
      totalCustomers: Number(customersResult[0].total_customers),
    }

    return NextResponse.json({
      success: true,
      stats,
      recentOrders,
    })
  } catch (error) {
    console.error("Stats fetch error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 })
  }
}
