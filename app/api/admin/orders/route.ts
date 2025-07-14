import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// Middleware to verify admin authentication
async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("admin-token")?.value

  if (!token) {
    throw new Error("Not authenticated")
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    return decoded
  } catch (error) {
    throw new Error("Invalid token")
  }
}

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request)

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const offset = (page - 1) * limit

    let whereClause = "WHERE 1=1"
    const params: any[] = []
    let paramIndex = 1

    if (search) {
      whereClause += ` AND (customer_name ILIKE $${paramIndex} OR customer_email ILIKE $${paramIndex} OR order_number ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    if (status) {
      whereClause += ` AND status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as count FROM orders ${whereClause}`
    const countResult = await sql(countQuery, params)
    const totalOrders = Number.parseInt(countResult[0].count)

    // Get orders with pagination
    const ordersQuery = `
      SELECT 
        id, order_number, customer_name, customer_email, customer_phone,
        shipping_address, total_amount, status, payment_status, payment_method,
        created_at, updated_at
      FROM orders 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    params.push(limit, offset)

    const orders = await sql(ordersQuery, params)

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total: totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
      },
    })
  } catch (error) {
    console.error("Get orders error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === "Not authenticated" || error.message === "Invalid token" ? 401 : 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin(request)

    const orderData = await request.json()

    const result = await sql`
      INSERT INTO orders (
        order_number, customer_name, customer_email, customer_phone,
        shipping_address, billing_address, total_amount, status, 
        payment_status, payment_method, notes
      )
      VALUES (
        ${orderData.order_number}, ${orderData.customer_name}, ${orderData.customer_email}, 
        ${orderData.customer_phone || null}, ${orderData.shipping_address}, 
        ${orderData.billing_address || null}, ${orderData.total_amount}, 
        ${orderData.status || "pending"}, ${orderData.payment_status || "pending"}, 
        ${orderData.payment_method || null}, ${orderData.notes || null}
      )
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      order: result[0],
    })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
