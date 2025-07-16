import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching fresh orders data from database...")

    // Get fresh orders data directly - mirroring products API pattern
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
        subtotal::numeric as subtotal,
        delivery_charge::numeric as delivery_charge,
        total_amount::numeric as total_amount,
        status,
        payment_method,
        tracking_url,
        created_at,
        updated_at
      FROM orders 
      ORDER BY created_at DESC
    `

    const orders = await sql`${sql.unsafe(ordersQuery)}`
    console.log(`Found ${orders.length} orders in database`)

    // Get item counts for each order - similar to products API pattern
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
            subtotal: Number.parseFloat(order.subtotal) || 0,
            delivery_charge: Number.parseFloat(order.delivery_charge) || 0,
            total_amount: Number.parseFloat(order.total_amount) || 0,
            item_count: Number.parseInt(itemsResult[0]?.item_count) || 0,
            total_items: Number.parseInt(itemsResult[0]?.total_items) || 0,
          }
        } catch (error) {
          console.error(`Error getting items for order ${order.id}:`, error)
          return {
            ...order,
            subtotal: Number.parseFloat(order.subtotal) || 0,
            delivery_charge: Number.parseFloat(order.delivery_charge) || 0,
            total_amount: Number.parseFloat(order.total_amount) || 0,
            item_count: 0,
            total_items: 0,
          }
        }
      }),
    )

    console.log("Orders data processed successfully")

    const response = NextResponse.json({
      success: true,
      data: {
        orders: ordersWithItems,
        total: ordersWithItems.length,
        timestamp: new Date().toISOString(),
      },
    })

    // Set aggressive cache-busting headers - mirroring products API
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    response.headers.set("Last-Modified", new Date().toUTCString())
    response.headers.set("ETag", `"${Date.now()}"`)

    return response
  } catch (error) {
    console.error("Error fetching orders:", error)

    const errorResponse = NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )

    // Set cache-busting headers even for errors
    errorResponse.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
    errorResponse.headers.set("Pragma", "no-cache")
    errorResponse.headers.set("Expires", "0")

    return errorResponse
  }
}
