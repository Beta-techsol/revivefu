import type { NextRequest } from "next/server"
import { neon } from "@neondatabase/serverless"
import jwt from "jsonwebtoken"

const sql = neon(process.env.DATABASE_URL!)

async function requireAuth(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value

  if (!token) {
    throw new Error("Not authenticated")
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!)
    return true
  } catch {
    throw new Error("Invalid token")
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request)

    // Get total revenue
    const revenueResult = await sql`
      SELECT COALESCE(SUM(total_amount), 0) as total_revenue
      FROM orders 
      WHERE status != 'cancelled'
    `

    // Get order count
    const orderResult = await sql`
      SELECT COUNT(*) as total_orders
      FROM orders
    `

    // Get product count
    const productResult = await sql`
      SELECT COUNT(*) as total_products
      FROM products
    `

    // Get customer count (assuming we have customers table or unique emails in orders)
    const customerResult = await sql`
      SELECT COUNT(DISTINCT customer_email) as total_customers
      FROM orders
    `

    // Get recent orders
    const recentOrders = await sql`
      SELECT 
        id,
        order_number,
        customer_name,
        total_amount,
        status,
        TO_CHAR(created_at, 'YYYY-MM-DD') as date
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5
    `

    const stats = {
      totalRevenue: Number.parseFloat(revenueResult[0].total_revenue || 0),
      totalOrders: Number.parseInt(orderResult[0].total_orders || 0),
      totalProducts: Number.parseInt(productResult[0].total_products || 0),
      totalCustomers: Number.parseInt(customerResult[0].total_customers || 0),
      recentOrders: recentOrders.map((order) => ({
        id: `#${order.id}`,
        customer: order.customer_name,
        amount: `$${Number.parseFloat(order.total_amount || 0).toFixed(2)}`,
        status: order.status,
        date: order.date,
      })),
    }

    return Response.json(stats)
  } catch (error) {
    console.error("Stats fetch error:", error)
    return Response.json({ error: error.message }, { status: error.message === "Not authenticated" ? 401 : 500 })
  }
}
