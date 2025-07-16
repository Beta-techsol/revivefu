import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    console.log("=== ADMIN ORDERS API CALLED ===")
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    console.log("Query params:", { page, limit, status, search })

    // Force fresh database queries
    const timestamp = Date.now()

    // Build the base query
    const whereConditions = []

    if (status && status !== "all") {
      whereConditions.push(`status = '${status}'`)
    }

    if (search) {
      whereConditions.push(`(
        order_number ILIKE '%${search}%' OR 
        customer_name ILIKE '%${search}%' OR 
        customer_email ILIKE '%${search}%'
      )`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""
    const offset = (page - 1) * limit

    // Get total count with fresh query
    const countQuery = `SELECT COUNT(*) as total FROM orders ${whereClause}`
    console.log("Count query:", countQuery)

    const countResult = await sql.unsafe(countQuery)
    const total = Number.parseInt(countResult[0]?.total) || 0
    console.log("Total orders found:", total)

    // Get orders with pagination and fresh data
    const ordersQuery = `
      SELECT 
        id,
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        customer_city,
        customer_zip,
        total_amount,
        status,
        payment_method,
        created_at,
        updated_at
      FROM orders 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `

    console.log("Orders query:", ordersQuery)
    const orders = await sql.unsafe(ordersQuery)
    console.log(`Found ${orders.length} orders for page ${page}`)

    // Get item counts for each order with fresh queries
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
      timestamp: new Date().toISOString(),
      queryTime: timestamp,
    })

    // Aggressive no-cache headers
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    response.headers.set("Surrogate-Control", "no-store")
    response.headers.set("Last-Modified", new Date().toUTCString())
    response.headers.set("ETag", `"${timestamp}-${Math.random()}"`)

    console.log("=== ADMIN ORDERS API RESPONSE SENT ===")
    return response
  } catch (error) {
    console.error("=== ADMIN ORDERS API ERROR ===", error)
    const errorResponse = NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
    errorResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
    return errorResponse
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("=== CREATE ORDER API CALLED ===")
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
      const badRequestResponse = NextResponse.json(
        {
          success: false,
          error: "Missing required fields: customer_name, customer_email, customer_phone, customer_address",
        },
        { status: 400 },
      )
      badRequestResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
      return badRequestResponse
    }

    // Generate order number
    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Create the order with fresh insert
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
      const failResponse = NextResponse.json(
        {
          success: false,
          error: "Failed to create order",
        },
        { status: 500 },
      )
      failResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
      return failResponse
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

    console.log("Order created successfully:", newOrder.order_number)

    const response = NextResponse.json({
      success: true,
      data: newOrder,
      timestamp: new Date().toISOString(),
    })

    // Force no-cache for creates
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    response.headers.set("Last-Modified", new Date().toUTCString())

    console.log("=== CREATE ORDER API SUCCESS ===")
    return response
  } catch (error) {
    console.error("=== CREATE ORDER API ERROR ===", error)
    const errorResponse = NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
    errorResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
    return errorResponse
  }
}
