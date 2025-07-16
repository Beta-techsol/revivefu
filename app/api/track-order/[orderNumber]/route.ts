import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const { orderNumber } = params

    if (!orderNumber) {
      return NextResponse.json(
        {
          success: false,
          error: "Order number is required",
        },
        { status: 400 },
      )
    }

    console.log(`Tracking order: ${orderNumber}`)

    // Ensure we get fresh data by using a timestamp in the query
    const orderResult = await sql`
      SELECT *, EXTRACT(EPOCH FROM NOW()) as query_time FROM orders WHERE order_number = ${orderNumber}
    `

    if (orderResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      )
    }

    const order = orderResult[0]

    const itemsResult = await sql`
      SELECT * FROM order_items WHERE order_id = ${order.id}
    `

    const historyResult = await sql`
      SELECT * FROM order_status_history 
      WHERE order_id = ${order.id} 
      ORDER BY created_at ASC
    `

    console.log(`Order found with status: ${order.status}`)

    return NextResponse.json(
      {
        success: true,
        data: {
          ...order,
          items: itemsResult,
          status_history: historyResult,
        },
      },
      {
        headers: {
          // Prevent caching to ensure fresh data
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  } catch (error) {
    console.error("Error fetching order for tracking:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order",
      },
      { status: 500 },
    )
  }
}
