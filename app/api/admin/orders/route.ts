import type { NextRequest } from "next/server"
import { neon } from "@neondatabase/serverless"
import jwt from "jsonwebtoken"

const sql = neon(process.env.DATABASE_URL!)

// Middleware to check authentication
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

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const offset = (page - 1) * limit

    let whereClause = "WHERE 1=1"
    const params: any[] = []
    let paramIndex = 1

    if (status && status !== "all") {
      whereClause += ` AND status = $${paramIndex}`
      params.push(status.toLowerCase())
      paramIndex++
    }

    if (search) {
      whereClause += ` AND (order_number ILIKE $${paramIndex} OR customer_name ILIKE $${paramIndex + 1} OR customer_email ILIKE $${paramIndex + 2})`
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
      paramIndex += 3
    }

    // Get orders with item count
    const ordersQuery = `
      SELECT 
        o.*,
        COUNT(oi.id) as item_count,
        TO_CHAR(o.created_at, 'YYYY-MM-DD') as date
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereClause}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    params.push(limit, offset)
    const orders = await sql(ordersQuery, params)

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM orders ${whereClause}`
    const countParams = params.slice(0, -2) // Remove limit and offset
    const [{ total }] = await sql(countQuery, countParams)

    // Format orders for frontend
    const formattedOrders = orders.map((order) => ({
      id: `#${order.id}`,
      customer: order.customer_name,
      email: order.customer_email,
      total: Number.parseFloat(order.total_amount || 0),
      status: order.status,
      date: order.date,
      items: Number.parseInt(order.item_count || 0),
      payment: order.payment_method || "Credit Card",
    }))

    return Response.json({
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total: Number.parseInt(total),
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Orders fetch error:", error)
    return Response.json({ error: error.message }, { status: error.message === "Not authenticated" ? 401 : 500 })
  }
}
