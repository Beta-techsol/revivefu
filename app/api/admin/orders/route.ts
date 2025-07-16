import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    console.log("Fetching orders with filters:", { page, limit, status, search })

    // Build the base query conditions
    const whereConditions = []

    if (status && status !== "all") {
      whereConditions.push(`status = '${status}'`)
    }

    if (search) {
      const searchTerm = search.replace(/'/g, "''") // Escape single quotes
      whereConditions.push(`(
        order_number ILIKE '%${searchTerm}%' OR 
        customer_name ILIKE '%${searchTerm}%' OR 
        customer_email ILIKE '%${searchTerm}%'
      )`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""
    const offset = (page - 1) * limit

    // Get total count
    let totalQuery = `SELECT COUNT(*) as total FROM orders`
    if (whereClause) {
      totalQuery += ` ${whereClause}`
    }

    const countResult = await sql.unsafe(totalQuery)
    const total = Number.parseInt(countResult[0]?.total) || 0

    // Get orders with pagination
    let ordersQuery = `
      SELECT 
        id,
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        customer_city,
        customer_zip,
        subtotal,
        delivery_charge,
        total_amount,
        status,
        payment_method,
        created_at,
        updated_at
      FROM orders 
    `

    if (whereClause) {
      ordersQuery += ` ${whereClause}`
    }

    ordersQuery += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`

    const orders = await sql.unsafe(ordersQuery)

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

    // Set cache headers to prevent caching
    const response = NextResponse.json({
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

    // Add cache control headers
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")

    return response
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
    console.log("Creating new order with data:", body)

    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      customer_city,
      customer_zip,
      customer_landmark,
      special_instructions,
      subtotal,
      delivery_charge,
      total_amount,
      payment_method = "cash_on_delivery",
    } = body

    // Validate required fields
    if (!customer_name || !customer_email || !customer_phone || !customer_address) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: customer_name, customer_email, customer_phone, customer_address",
        },
        { status: 400 },
      )
    }

    // Generate order number
    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Create the order
    const orderResult = await sql`
      INSERT INTO orders (
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        customer_city,
        customer_zip,
        customer_landmark,
        special_instructions,
        subtotal,
        delivery_charge,
        total_amount,
        status,
        payment_method,
        created_at,
        updated_at
      ) VALUES (
        ${orderNumber},
        ${customer_name},
        ${customer_email},
        ${customer_phone},
        ${customer_address},
        ${customer_city || ""},
        ${customer_zip || ""},
        ${customer_landmark || ""},
        ${special_instructions || ""},
        ${subtotal || 0},
        ${delivery_charge || 0},
        ${total_amount || 0},
        ${"pending"},
        ${payment_method},
        NOW(),
        NOW()
      ) RETURNING *
    `

    if (orderResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create order",
        },
        { status: 500 },
      )
    }

    const newOrder = orderResult[0]

    // Add initial status history
    try {
      await sql`
        INSERT INTO order_status_history (order_id, status, description, created_at)
        VALUES (${newOrder.id}, ${"pending"}, ${"Order created by admin"}, NOW())
      `
    } catch (historyError) {
      console.error("Error adding initial status history:", historyError)
    }

    console.log("Order created successfully:", newOrder)

    return NextResponse.json({
      success: true,
      data: newOrder,
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
