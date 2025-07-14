import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("admin-token")?.value

  if (!token) {
    throw new Error("Not authenticated")
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    return decoded
  } catch (error) {
    throw new Error("Invalid token")
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAdmin(request)

    const orderId = Number.parseInt(params.id)

    // Get order details
    const orders = await sql`
      SELECT 
        id, order_number, customer_name, customer_email, customer_phone,
        shipping_address, billing_address, total_amount, status, 
        payment_status, payment_method, notes, created_at, updated_at
      FROM orders 
      WHERE id = ${orderId}
    `

    if (orders.length === 0) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    // Get order items
    const orderItems = await sql`
      SELECT 
        id, product_name, product_sku, quantity, unit_price, total_price
      FROM order_items 
      WHERE order_id = ${orderId}
    `

    const order = {
      ...orders[0],
      items: orderItems,
    }

    return NextResponse.json({
      success: true,
      order,
    })
  } catch (error) {
    console.error("Get order error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === "Not authenticated" || error.message === "Invalid token" ? 401 : 500 },
    )
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAdmin(request)

    const orderId = Number.parseInt(params.id)

    // Delete order (order_items will be deleted automatically due to CASCADE)
    const result = await sql`
      DELETE FROM orders 
      WHERE id = ${orderId}
      RETURNING id
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
