import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching simple orders list...")

    // Get orders with basic info and item counts
    const ordersResult = await sql`
      SELECT 
        o.id,
        o.order_number,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.customer_address,
        o.customer_city,
        o.customer_zip,
        o.total_amount,
        o.status,
        o.payment_method,
        o.created_at,
        o.updated_at,
        COALESCE(COUNT(oi.id), 0) as item_count,
        COALESCE(SUM(oi.quantity), 0) as total_items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id, o.order_number, o.customer_name, o.customer_email, 
               o.customer_phone, o.customer_address, o.customer_city, 
               o.customer_zip, o.total_amount, o.status, o.payment_method,
               o.created_at, o.updated_at
      ORDER BY o.created_at DESC
    `

    console.log(`Found ${ordersResult.length} orders`)

    const response = NextResponse.json({
      success: true,
      data: {
        orders: ordersResult,
        total: ordersResult.length,
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
