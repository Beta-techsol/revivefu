import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const { orderNumber } = params
    console.log(`Tracking order with fresh data: ${orderNumber}`)

    if (!orderNumber) {
      return NextResponse.json(
        {
          success: false,
          error: "Order number is required",
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      )
    }

    // Get fresh order details from database - mirroring products API pattern
    const orderResult = await sql`
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
      WHERE order_number = ${orderNumber}
    `

    if (orderResult.length === 0) {
      const notFoundResponse = NextResponse.json(
        {
          success: false,
          error: "Order not found",
          timestamp: new Date().toISOString(),
        },
        { status: 404 },
      )

      // Set cache-busting headers even for not found
      notFoundResponse.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
      notFoundResponse.headers.set("Pragma", "no-cache")
      notFoundResponse.headers.set("Expires", "0")

      return notFoundResponse
    }

    const order = orderResult[0]
    console.log(`Found order with current status: ${order.status}`)

    // Get fresh order items - mirroring products API pattern
    const itemsResult = await sql`
      SELECT 
        id,
        order_id,
        product_id,
        product_name,
        product_sku,
        quantity,
        unit_price::numeric as unit_price,
        total_price::numeric as total_price
      FROM order_items 
      WHERE order_id = ${order.id}
      ORDER BY id ASC
    `

    // Get fresh status history - mirroring products API pattern
    const historyResult = await sql`
      SELECT 
        id,
        order_id,
        status,
        description,
        created_at
      FROM order_status_history 
      WHERE order_id = ${order.id} 
      ORDER BY created_at ASC
    `

    console.log(`Order items: ${itemsResult.length}, Status history: ${historyResult.length}`)

    // Process data similar to products API
    const processedOrder = {
      ...order,
      subtotal: Number.parseFloat(order.subtotal) || 0,
      delivery_charge: Number.parseFloat(order.delivery_charge) || 0,
      total_amount: Number.parseFloat(order.total_amount) || 0,
      items: itemsResult.map((item) => ({
        ...item,
        unit_price: Number.parseFloat(item.unit_price) || 0,
        total_price: Number.parseFloat(item.total_price) || 0,
      })),
      status_history: historyResult,
    }

    const response = NextResponse.json({
      success: true,
      data: processedOrder,
      timestamp: new Date().toISOString(),
    })

    // Set aggressive cache-busting headers - mirroring products and shop APIs
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    response.headers.set("Last-Modified", new Date().toUTCString())
    response.headers.set("ETag", `"${Date.now()}-${orderNumber}"`)

    return response
  } catch (error) {
    console.error("Error fetching order for tracking:", error)

    const errorResponse = NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order",
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
