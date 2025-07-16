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

    // Build base query
    let ordersQuery = `
      SELECT 
        o.*
      FROM orders o
    `

    let countQuery = `SELECT COUNT(*) as total FROM orders`

    // Add WHERE conditions
    const conditions = []

    if (status && status !== "all") {
      conditions.push(`status = '${status}'`)
    }

    if (search) {
      conditions.push(
        `(order_number ILIKE '%${search}%' OR customer_name ILIKE '%${search}%' OR customer_email ILIKE '%${search}%')`,
      )
    }

    if (conditions.length > 0) {
      const whereClause = ` WHERE ${conditions.join(" AND ")}`
      ordersQuery += whereClause
      countQuery += whereClause
    }

    ordersQuery += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`

    // Execute queries
    const orders = await sql(ordersQuery)
    const countResult = await sql(countQuery)
    const total = Number.parseInt(countResult[0].total)

    // Get item counts for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        try {
          const itemsResult = await sql`
            SELECT COUNT(*) as item_count, COALESCE(SUM(quantity), 0) as total_items
            FROM order_items 
            WHERE order_id = ${order.id}
          `
          return {
            ...order,
            item_count: Number.parseInt(itemsResult[0]?.item_count) || 0,
            total_items: Number.parseInt(itemsResult[0]?.total_items) || 0,
          }
        } catch (error) {
          console.error(`Error getting items for order ${order.id}:`, error)
          return {
            ...order,
            item_count: 0,
            total_items: 0,
          }
        }
      }),
    )

    return NextResponse.json({
      success: true,
      data: {
        orders: ordersWithItems,
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
