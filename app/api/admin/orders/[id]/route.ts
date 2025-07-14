import type { NextRequest } from "next/server"
import { executeQuery, executeQuerySingle } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// GET /api/admin/orders/[id] - Get single order with items
export const GET = requireAuth(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const order = await executeQuerySingle("SELECT * FROM orders WHERE id = $1", [params.id])

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 })
    }

    const items = await executeQuery("SELECT * FROM order_items WHERE order_id = $1", [params.id])

    return Response.json({ order: { ...order, items } })
  } catch (error) {
    console.error("Order fetch error:", error)
    return Response.json({ error: "Failed to fetch order" }, { status: 500 })
  }
})

// PUT /api/admin/orders/[id] - Update order status
export const PUT = requireAuth(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { status, tracking_number, notes } = await request.json()

    const [order] = await executeQuery(
      `
      UPDATE orders SET 
        status = $1, 
        tracking_number = $2, 
        notes = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `,
      [status, tracking_number, notes, params.id],
    )

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 })
    }

    return Response.json({ order })
  } catch (error) {
    console.error("Order update error:", error)
    return Response.json({ error: "Failed to update order" }, { status: 500 })
  }
})
