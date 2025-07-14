import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import jwt from "jsonwebtoken"

const sql = neon(process.env.DATABASE_URL!)

// Middleware to verify admin authentication
async function verifyAdmin(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      throw new Error("No token")
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    return decoded
  } catch (error) {
    throw new Error("Unauthorized")
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

    // Build where clause
    let whereClause = "WHERE 1=1"
    const params: any[] = []

    if (search) {
      whereClause += ` AND (customer_name ILIKE $${params.length + 1} OR customer_email ILIKE $${params.length + 2} OR order_number ILIKE $${params.length + 3})`
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    if (status) {
      whereClause += ` AND status = $${params.length + 1}`
      params.push(status)
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as count FROM orders ${whereClause}`
    const countResult = await sql.unsafe(countQuery, params)
    const totalOrders = Number.parseInt(countResult[0].count)

    // Get orders with pagination
    const ordersQuery = `
      SELECT id, order_number, customer_name, customer_email, customer_phone, 
             shipping_address, total_amount, status, payment_status, payment_method, 
             created_at, updated_at
      FROM orders 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `
    params.push(limit, offset)

    const orders = await sql.unsafe(ordersQuery, params)

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total: totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
      },
    })
  } catch (error) {
    console.error("Orders fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin(request)

    const orderData = await request.json()

    const result = await sql`
      INSERT INTO orders (
        order_number, customer_name, customer_email, customer_phone,
        shipping_address, total_amount, status, payment_status, payment_method
      )
      VALUES (
        ${orderData.order_number}, ${orderData.customer_name}, ${orderData.customer_email},
        ${orderData.customer_phone}, ${orderData.shipping_address}, ${orderData.total_amount},
        ${orderData.status}, ${orderData.payment_status}, ${orderData.payment_method}
      )
      RETURNING *
    `

    return NextResponse.json({ order: result[0] })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
