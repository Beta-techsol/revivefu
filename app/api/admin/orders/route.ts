import type { NextRequest } from "next/server"
import { executeQuery } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// GET /api/admin/orders - List all orders
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const offset = (page - 1) * limit

    let query = `
      SELECT o.*, COUNT(oi.id) as item_count
      FROM orders o 
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE 1=1
    `
    const params: any[] = []
    let paramIndex = 1

    if (status && status !== "all") {
      query += ` AND o.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (search) {
      query += ` AND (o.order_number ILIKE $${paramIndex} OR o.customer_name ILIKE $${paramIndex + 1} OR o.customer_email ILIKE $${paramIndex + 2})`
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
      paramIndex += 3
    }

    query += ` GROUP BY o.id ORDER BY o.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    const orders = await executeQuery(query, params)

    // Get total count
    let countQuery = "SELECT COUNT(*) as total FROM orders WHERE 1=1"
    const countParams: any[] = []
    let countParamIndex = 1

    if (status && status !== "all") {
      countQuery += ` AND status = $${countParamIndex}`
      countParams.push(status)
      countParamIndex++
    }

    if (search) {
      countQuery += ` AND (order_number ILIKE $${countParamIndex} OR customer_name ILIKE $${countParamIndex + 1} OR customer_email ILIKE $${countParamIndex + 2})`
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    const [{ total }] = await executeQuery(countQuery, countParams)

    return Response.json({
      orders,
      pagination: {
        page,
        limit,
        total: Number.parseInt(total),
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Orders fetch error:", error)
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
})
