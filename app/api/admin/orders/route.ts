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

    let whereClause = "WHERE 1=1"
    const params: any[] = []

    if (status && status !== "all") {
      whereClause += ` AND o.status = $${params.length + 1}`
      params.push(status)
    }

    if (search) {
      whereClause += ` AND (o.customer_name ILIKE $${params.length + 1} OR o.customer_email ILIKE $${params.length + 2} OR o.order_number ILIKE $${params.length + 3})`
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM orders o
      ${whereClause}
    `
    const countResult = await sql(countQuery, params)
    const total = Number.parseInt(countResult[0].total)

    // Get orders with pagination
    const ordersQuery = `
      SELECT 
        o.*,
        COUNT(oi.id) as total_items,
        COALESCE(SUM(oi.quantity), 0) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereClause}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `
    params.push(limit, offset)

    const orders = await sql(ordersQuery, params)

    return NextResponse.json({
      success: true,
      data: {
        orders,
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
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
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
        ${customer_address}, ${customer_city}, ${customer_zip}, ${customer_landmark || null},
        ${special_instructions || null}, ${subtotal}, ${delivery_charge}, ${total_amount},
        'pending', 'cod', ${`/track-order/${orderNumber}`}
      ) RETURNING id, order_number
    `

    const orderId = orderResult[0].id

    // Create order items
    for (const item of items) {
      await sql`
        INSERT INTO order_items (
          order_id, product_id, product_name, product_sku,
          quantity, unit_price, total_price
        ) VALUES (
          ${orderId}, ${item.id || null}, ${item.name}, ${item.sku || null},
          ${item.quantity}, ${item.price}, ${item.price * item.quantity}
        )
      `
    }

    // Create initial status history
    await sql`
      INSERT INTO order_status_history (order_id, status, description)
      VALUES (${orderId}, 'pending', 'Order placed successfully')
    `

    // Send email notification
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-order-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: {
            order_number: orderNumber,
            customer_name,
            customer_email,
            customer_phone,
            customer_address,
            customer_city,
            customer_zip,
            status: "pending",
            items,
            subtotal,
            delivery_charge,
            total_amount,
            special_instructions,
          },
          type: "new_order",
        }),
      })
    } catch (emailError) {
      console.error("Email notification failed:", emailError)
      // Don't fail the order creation if email fails
    }

    return NextResponse.json({
      success: true,
      data: {
        order_id: orderId,
        order_number: orderNumber,
      },
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}
