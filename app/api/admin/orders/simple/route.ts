import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching orders from simple API...")

    // Add cache-busting headers
    const headers = {
      "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
    }

    // Fetch fresh data from database with explicit ordering
    const ordersResult = await sql`
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
        tracking_url,
        created_at,
        updated_at
      FROM orders 
      ORDER BY updated_at DESC, created_at DESC
    `

    console.log(`Found ${ordersResult.length} orders in database`)

    // Get item counts for each order
    const ordersWithItems = await Promise.all(
      ordersResult.map(async (order) => {
        try {
          const itemsResult = await sql`
            SELECT COUNT(*) as item_count, COALESCE(SUM(quantity), 0) as total_items
            FROM order_items 
            WHERE order_id = ${order.id}
          `

          const itemCount = Number.parseInt(itemsResult[0]?.item_count) || 0
          const totalItems = Number.parseInt(itemsResult[0]?.total_items) || 0

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

    console.log("Orders with items calculated:", ordersWithItems.length)

    const response = NextResponse.json({
      success: true,
      data: {
        orders: ordersWithItems,
        timestamp: new Date().toISOString(),
        total: ordersWithItems.length,
      },
    })

    // Set cache-busting headers on response
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error) {
    console.error("Error in simple orders API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  }
}
