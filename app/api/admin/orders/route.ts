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
    const whereConditions: string[] = []
    const params: any[] = []

    if (status && status !== "all") {
      whereConditions.push(`o.status = $${params.length + 1}`)
      params.push(status)
    }

    if (search) {
      whereConditions.push(
        `(o.order_number ILIKE $${params.length + 1} OR o.customer_name ILIKE $${params.length + 1} OR o.customer_email ILIKE $${params.length + 1})`,
      )
      params.push(`%${search}%`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

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
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `

    const ordersResult = await sql(ordersQuery, [...params, limit, offset])

    // Calculate pagination
    const pages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        orders: ordersResult.map((order) => ({
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      customer_city,
      customer_zip,
      customer_landmark,
      special_instructions,
      items,
      subtotal,
      delivery_charge,
      total_amount,
    } = body

    // Validate required fields
    if (!customer_name || !customer_email || !customer_phone || !customer_address || !items || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // Generate unique order number
    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Create order
    const orderResult = await sql`
      INSERT INTO orders (
        order_number, customer_name, customer_email, customer_phone,
        customer_address, customer_city, customer_zip, customer_landmark,
        special_instructions, subtotal, delivery_charge, total_amount,
        status, payment_method, tracking_url
      ) VALUES (
        ${orderNumber}, ${customer_name}, ${customer_email}, ${customer_phone},
        ${customer_address}, ${customer_city}, ${customer_zip}, ${customer_landmark || ""},
        ${special_instructions || ""}, ${subtotal}, ${delivery_charge}, ${total_amount},
        'pending', 'cod', ${`/track-order/${orderNumber}`}
      ) RETURNING *
    `

    const order = orderResult[0]

    // Create order items
    for (const item of items) {
      await sql`
        INSERT INTO order_items (
          order_id, product_id, product_name, product_sku,
          quantity, unit_price, total_price
        ) VALUES (
          ${order.id}, ${item.id || null}, ${item.name}, ${item.sku || ""},
          ${item.quantity}, ${item.price}, ${item.price * item.quantity}
        )
      `
    }

    // Create initial status history
    await sql`
      INSERT INTO order_status_history (order_id, status, description)
      VALUES (${order.id}, 'pending', 'Order placed successfully')
    `

    // Send email notification (optional - won't fail if email service is not configured)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get("origin") || "http://localhost:3000"
      await fetch(`${baseUrl}/api/send-order-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: { ...order, items },
          type: "new_order",
        }),
      })
    } catch (emailError) {
      console.error("Failed to send email (non-critical):", emailError)
    }

    return NextResponse.json({
      success: true,
      data: { ...order, items },
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
