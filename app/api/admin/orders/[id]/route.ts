import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import jwt from "jsonwebtoken"

const sql = neon(process.env.DATABASE_URL!)

// Middleware to verify admin authentication
async function verifyAdmin(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      throw new Error("No token")
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    return decoded
  } catch (error) {
    throw new Error("Unauthorized")
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAdmin(request)

    const orderId = Number.parseInt(params.id)

    // Get order details
    const orders = await sql`
      SELECT * FROM orders WHERE id = ${orderId}
    `

    if (orders.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Get order items
    const orderItems = await sql`
      SELECT * FROM order_items WHERE order_id = ${orderId}
    `

    return NextResponse.json({
      order: orders[0],
      items: orderItems,
    })
  } catch (error) {
    console.error("Order fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAdmin(request)

    const orderId = Number.parseInt(params.id)
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
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${orderId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ order: result[0] })
  } catch (error) {
    console.error("Order update error:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAdmin(request)

    const orderId = Number.parseInt(params.id)

    // Delete order items first (due to foreign key constraint)
    await sql`DELETE FROM order_items WHERE order_id = ${orderId}`

    // Delete order
    const result = await sql`
      DELETE FROM orders WHERE id = ${orderId} RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Order deletion error:", error)
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 })
  }
}
