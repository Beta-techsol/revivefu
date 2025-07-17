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

    console.log("Getting orders for user:", user.email)

    // Get user orders with item count
    const ordersResult = await sql`
      SELECT 
        o.id,
        o.order_number,
        o.created_at,
        o.total_amount,
        o.status,
        (
          SELECT COALESCE(SUM(quantity), 0)
          FROM order_items 
          WHERE order_id = o.id
        ) as item_count
      FROM orders o
      WHERE o.customer_email = ${user.email}
      ORDER BY o.created_at DESC
    `

    return NextResponse.json({
      success: true,
      data: ordersResult,
    })
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}
