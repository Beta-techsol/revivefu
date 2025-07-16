import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    console.log("=== SIMPLE ORDERS API CALLED ===")
    console.log("Request timestamp:", new Date().toISOString())

    // Force fresh database connection and query
    const timestamp = Date.now()
    console.log("Executing fresh database query at:", timestamp)

    // Get fresh orders data directly from database
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
        customer_landmark,
        special_instructions,
        subtotal,
        delivery_charge,
        total_amount,
        status,
        payment_method,
        created_at,
        updated_at
      FROM orders 
      ORDER BY created_at DESC
    `

    console.log("Executing query:", ordersQuery)
    const orders = await sql.unsafe(ordersQuery)
    console.log(`Found ${orders.length} orders in database`)

    // Get item counts for each order with fresh data
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        try {
          const itemsResult = await sql`
            SELECT COUNT(*) as item_count, COALESCE(SUM(quantity), 0) as total_items
            FROM order_items 
            WHERE order_id = ${order.id}
          `

          const itemCount = Number.parseInt(itemsResult[0]?.item_count) || 0
          const totalItems = Number.parseInt(itemsResult[0]?.total_items) || 0

          console.log(`Order ${order.order_number}: ${itemCount} items, ${totalItems} total quantity`)

          return {
            ...order,
            item_count: itemCount,
            total_items: totalItems,
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

    console.log("Final orders data prepared:", ordersWithItems.length)

    // Create response with aggressive no-cache headers
    const response = NextResponse.json({
      success: true,
      data: {
        orders: ordersWithItems,
        timestamp: new Date().toISOString(),
        queryTime: timestamp,
      },
    })

    // Set multiple cache-busting headers
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    response.headers.set("Surrogate-Control", "no-store")
    response.headers.set("X-Accel-Expires", "0")
    response.headers.set("Last-Modified", new Date().toUTCString())
    response.headers.set("ETag", `"${timestamp}-${Math.random()}"`)

    console.log("=== SIMPLE ORDERS API RESPONSE SENT ===")
    return response
  } catch (error) {
    console.error("=== SIMPLE ORDERS API ERROR ===", error)

    const errorResponse = NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )

    // Set no-cache headers even for errors
    errorResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
    errorResponse.headers.set("Pragma", "no-cache")
    errorResponse.headers.set("Expires", "0")

    return errorResponse
  }
}
