import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyToken } from "@/lib/user-auth"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    // Get user from JWT token
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
    }

    console.log("Getting dashboard data for user:", user.email)

    // Get total orders count
    const totalOrdersResult = await sql`
      SELECT COUNT(*) as total_orders
      FROM orders 
      WHERE customer_email = ${user.email}
    `
    const totalOrders = Number.parseInt(totalOrdersResult[0]?.total_orders) || 0

    // Get orders in transit (shipped, out_for_delivery)
    const inTransitResult = await sql`
      SELECT COUNT(*) as in_transit
      FROM orders 
      WHERE customer_email = ${user.email} 
      AND status IN ('shipped', 'out_for_delivery')
    `
    const inTransit = Number.parseInt(inTransitResult[0]?.in_transit) || 0

    // Get total spent (sum of all delivered orders)
    const totalSpentResult = await sql`
      SELECT COALESCE(SUM(total_amount), 0) as total_spent
      FROM orders 
      WHERE customer_email = ${user.email} 
      AND status = 'delivered'
    `
    const totalSpent = Number.parseFloat(totalSpentResult[0]?.total_spent) || 0

    // Get recent orders (last 3)
    const recentOrdersResult = await sql`
      SELECT 
        id,
        order_number,
        created_at,
        total_amount,
        status,
        (
          SELECT COUNT(*) 
          FROM order_items 
          WHERE order_id = orders.id
        ) as item_count
      FROM orders 
      WHERE customer_email = ${user.email}
      ORDER BY created_at DESC 
      LIMIT 3
    `

    const recentOrders = recentOrdersResult.map((order) => ({
      id: order.order_number,
      date: new Date(order.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      items: Number.parseInt(order.item_count) || 0,
      total: `$${Number.parseFloat(order.total_amount).toLocaleString()}`,
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1).replace("_", " "),
    }))

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        inTransit,
        totalSpent,
        recentOrders,
        user: {
          name: user.first_name + " " + user.last_name,
          email: user.email,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
