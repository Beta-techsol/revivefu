import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const offset = (page - 1) * limit

    // Build the WHERE clause
    let whereClause = ""
    const params: any[] = []
    let paramIndex = 1

    if (status && status !== "all") {
      whereClause += `WHERE o.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (search) {
      const searchCondition = `(o.order_number ILIKE $${paramIndex} OR o.customer_name ILIKE $${paramIndex} OR o.customer_email ILIKE $${paramIndex})`
      if (whereClause) {
        whereClause += ` AND ${searchCondition}`
      } else {
        whereClause += `WHERE ${searchCondition}`
      }
      params.push(`%${search}%`)
      paramIndex++
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM orders o
      ${whereClause}
    `

    const countResult = await sql(countQuery, params)
    const total = Number.parseInt(countResult[0]?.total || "0")

    // Get orders with item counts
    const ordersQuery = `
      SELECT 
        o.*,
        COUNT(oi.id) as item_count,
        COALESCE(SUM(oi.quantity), 0) as total_items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereClause}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    params.push(limit, offset)
    const orders = await sql(ordersQuery, params)

    // Calculate pagination
    const pages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        orders: orders.map((order) => ({
          ...order,
          item_count: Number.parseInt(order.item_count || "0"),
          total_items: Number.parseInt(order.total_items || "0"),
        })),
        pagination: {
          page,
          limit,
          total,
          pages,
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
