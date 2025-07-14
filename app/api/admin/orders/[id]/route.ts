import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// Middleware to verify admin authentication
async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    throw new Error("No authentication token")
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
  return decoded
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAdmin(request)

    const orderId = params.id

    // Get order details
    const orders = await sql`
      SELECT * FROM orders WHERE id = ${orderId}
    `

    if (orders.length === 0) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    // Get order items
    const orderItems = await sql`
      SELECT * FROM order_items WHERE order_id = ${orderId}
    `

    return NextResponse.json({
      success: true,
      order: {
        ...orders[0],
        items: orderItems,
      },
    })
  } catch (error) {
    console.error("Get order error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAdmin(request)

    const orderId = params.id
    const updateData = await request.json()

    const result = await sql`
      UPDATE orders 
      SET 
        customer_name = ${updateData.customer_name},
        customer_email = ${updateData.customer_email},
        customer_phone = ${updateData.customer_phone},
        shipping_address = ${updateData.shipping_address},
        total_amount = ${updateData.total_amount},
        status = ${updateData.status},
        payment_status = ${updateData.payment_status},
        payment_method = ${updateData.payment_method},
        notes = ${updateData.notes},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${orderId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      order: result[0],
    })
  } catch (error) {
    console.error("Update order error:", error)
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAdmin(request)

    const orderId = params.id

    // Delete order (order_items will be deleted automatically due to CASCADE)
    const result = await sql`
      DELETE FROM orders WHERE id = ${orderId} RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    })
  } catch (error) {
    console.error("Delete order error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete order" }, { status: 500 })
  }
}
