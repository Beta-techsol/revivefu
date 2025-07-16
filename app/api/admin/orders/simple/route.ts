import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching orders from database...")

    // Simple query like products API
    const orders = await sql`
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
      ORDER BY created_at DESC
    `

    // Get item counts
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
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
      }),
    )

    console.log(`Found ${ordersWithItems.length} orders`)

    return NextResponse.json({
      success: true,
      data: {
        orders: ordersWithItems,
        total: ordersWithItems.length,
      },
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders",
      },
      { status: 500 },
    )
  }
}
