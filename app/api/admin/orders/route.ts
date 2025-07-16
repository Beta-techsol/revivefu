import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const offset = (page - 1) * limit

    // Base query
    let ordersQuery = `
      SELECT 
        o.*,
        COALESCE(oi.item_count, 0) as item_count,
        COALESCE(oi.total_items, 0) as total_items
      FROM orders o
      LEFT JOIN (
        SELECT 
          order_id,
          COUNT(*) as item_count,
          SUM(quantity) as total_items
        FROM order_items
        GROUP BY order_id
      ) oi ON o.id = oi.order_id
    `

    let countQuery = `SELECT COUNT(*) as total FROM orders`

    // Add WHERE conditions
    const conditions = []
    const params = []

    if (status && status !== "all") {
      conditions.push(`o.status = $${params.length + 1}`)
      params.push(status)
    }

    if (search) {
      conditions.push(
        `(o.order_number ILIKE $${params.length + 1} OR o.customer_name ILIKE $${params.length + 2} OR o.customer_email ILIKE $${params.length + 3})`,
      )
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    if (conditions.length > 0) {
      const whereClause = ` WHERE ${conditions.join(" AND ")}`
      ordersQuery += whereClause
      countQuery += whereClause.replace(/o\./g, "") // Remove table alias for count query
    }

    ordersQuery += ` ORDER BY o.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    // Execute queries
    const orders = await sql(ordersQuery, params)

    // For count query, we need to adjust params if search is used
    const countParams = []
    if (status && status !== "all") {
      countParams.push(status)
    }
    if (search) {
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    const countResult = await sql(countQuery, countParams)
    const total = Number.parseInt(countResult[0].total)

    return NextResponse.json({
      success: true,
      data: {
        orders: orders.map((order) => ({
          ...order,
          item_count: Number.parseInt(order.item_count) || 0,
          total_items: Number.parseInt(order.total_items) || 0,
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
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
        ${customer_address}, ${customer_city || ""}, ${customer_zip || ""}, ${customer_landmark || ""},
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
