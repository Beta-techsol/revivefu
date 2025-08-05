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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const offset = (page - 1) * limit

    // Build where conditions
    let whereConditions = `WHERE customer_email = '${user.email}'`

    if (search) {
      whereConditions += ` AND (order_number ILIKE '%${search}%' OR customer_name ILIKE '%${search}%')`
    }

    if (status) {
      whereConditions += ` AND status = '${status}'`
    }

    // Get total count
    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM orders 
      ${sql.unsafe(whereConditions)}
    `
    const total = Number.parseInt(countResult[0]?.total) || 0

    // Get orders with pagination
    const ordersResult = await sql`
      SELECT 
        id,
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        total_amount,
        status,
        payment_status,
        created_at,
        updated_at,
        (
          SELECT COUNT(*) 
          FROM order_items 
          WHERE order_id = orders.id
        ) as item_count,
        (
          SELECT json_agg(
            json_build_object(
              'product_name', product_name,
              'quantity', quantity,
              'price', price
            )
          )
          FROM order_items 
          WHERE order_id = orders.id
        ) as items
      FROM orders 
      ${sql.unsafe(whereConditions)}
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `

    const orders = ordersResult.map((order) => ({
      id: order.id,
      orderNumber: order.order_number,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      shippingAddress: order.shipping_address,
      totalAmount: Number.parseFloat(order.total_amount),
      status: order.status,
      paymentStatus: order.payment_status,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      itemCount: Number.parseInt(order.item_count) || 0,
      items: order.items || [],
    }))

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
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
