import type { NextRequest } from "next/server"
import { neon } from "@neondatabase/serverless"
import jwt from "jsonwebtoken"

const sql = neon(process.env.DATABASE_URL!)

async function requireAuth(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value

  if (!token) {
    throw new Error("Not authenticated")
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!)
    return true
  } catch {
    throw new Error("Invalid token")
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request)

    const orderId = params.id.replace("#", "") // Remove # if present

    const orders = await sql`
      SELECT * FROM orders WHERE id = ${orderId}
    `

    if (orders.length === 0) {
      return Response.json({ error: "Order not found" }, { status: 404 })
    }

    const order = orders[0]

    const items = await sql`
      SELECT * FROM order_items WHERE order_id = ${orderId}
    `

    const orderWithItems = {
      ...order,
      items: items.map((item) => ({
        id: item.id,
        name: item.product_name,
        sku: item.product_sku || "N/A",
        price: Number.parseFloat(item.unit_price),
        quantity: item.quantity,
        image: "/placeholder.svg?height=64&width=64&text=Product",
      })),
    }

    return Response.json({ order: orderWithItems })
  } catch (error) {
    console.error("Order fetch error:", error)
    return Response.json({ error: error.message }, { status: error.message === "Not authenticated" ? 401 : 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request)

    const orderId = params.id.replace("#", "")
    const { status, tracking_number, notes } = await request.json()

    const result = await sql`
      UPDATE orders 
      SET 
        status = ${status},
        tracking_number = ${tracking_number || null},
        notes = ${notes || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${orderId}
      RETURNING *
    `

    if (result.length === 0) {
      return Response.json({ error: "Order not found" }, { status: 404 })
    }

    return Response.json({
      success: true,
      order: result[0],
      message: `Order status updated to ${status}`,
    })
  } catch (error) {
    console.error("Order update error:", error)
    return Response.json({ error: error.message }, { status: error.message === "Not authenticated" ? 401 : 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request)

    const orderId = params.id.replace("#", "")

    // Delete order items first (due to foreign key constraint)
    await sql`DELETE FROM order_items WHERE order_id = ${orderId}`

    // Delete the order
    const result = await sql`DELETE FROM orders WHERE id = ${orderId} RETURNING *`

    if (result.length === 0) {
      return Response.json({ error: "Order not found" }, { status: 404 })
    }

    return Response.json({
      success: true,
      message: "Order deleted successfully",
    })
  } catch (error) {
    console.error("Order delete error:", error)
    return Response.json({ error: error.message }, { status: error.message === "Not authenticated" ? 401 : 500 })
  }
}
