import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const { orderNumber } = params
    console.log(`=== TRACK ORDER ${orderNumber} API CALLED ===`)
    console.log("Request timestamp:", new Date().toISOString())

    if (!orderNumber) {
      const badRequestResponse = NextResponse.json(
        {
          success: false,
          error: "Order number is required",
        },
        { status: 400 },
      )
      badRequestResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
      return badRequestResponse
    }

    // Force fresh database query
    const timestamp = Date.now()
    console.log("Executing fresh tracking query at:", timestamp)

    // Get fresh order details from database
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
        subtotal,
        delivery_charge,
        total_amount,
        status,
        payment_method,
        tracking_url,
        created_at,
        updated_at
      FROM orders 
      WHERE order_number = ${orderNumber}
    `

    if (orderResult.length === 0) {
      console.log(`Order ${orderNumber} not found in database`)
      const notFoundResponse = NextResponse.json(
        {
          success: false,
          error: "Order not found",
          timestamp: new Date().toISOString(),
        },
        { status: 404 },
      )
      notFoundResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
      return notFoundResponse
    }

    const order = orderResult[0]
    console.log(`Found order ${orderNumber} with status: ${order.status}`)

    // Get fresh order items
    const itemsResult = await sql`
      SELECT 
        id,
        order_id,
        product_id,
        product_name,
        product_sku,
        quantity,
        unit_price,
        total_price
      FROM order_items 
      WHERE order_id = ${order.id}
    `

    // Get fresh status history
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

    const response = NextResponse.json({
      success: true,
      data: {
        ...order,
        items: itemsResult,
        status_history: historyResult,
      },
      timestamp: new Date().toISOString(),
      queryTime: timestamp,
    })

    // Aggressive no-cache headers for tracking
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    response.headers.set("Surrogate-Control", "no-store")
    response.headers.set("X-Accel-Expires", "0")
    response.headers.set("Last-Modified", new Date().toUTCString())
    response.headers.set("ETag", `"${timestamp}-${Math.random()}"`)

    console.log(`=== TRACK ORDER ${orderNumber} RESPONSE SENT ===`)
    return response
  } catch (error) {
    console.error(`=== TRACK ORDER ${params.orderNumber} ERROR ===`, error)
    const errorResponse = NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
    return errorResponse
  }
}
