import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    // Get order details
    const orderResult = await sql`
      SELECT * FROM orders WHERE id = ${orderId}
    `

    if (orderResult.length === 0) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    const order = orderResult[0]

    // Get order items
    const itemsResult = await sql`
      SELECT * FROM order_items WHERE order_id = ${orderId}
    `

    // Get status history
    const historyResult = await sql`
      SELECT * FROM order_status_history 
      WHERE order_id = ${orderId} 
      ORDER BY created_at DESC
    `

    // Mark as viewed by admin
    await sql`
      UPDATE orders 
      SET is_viewed_by_admin = true, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${orderId}
    `

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        items: itemsResult,
        history: historyResult,
      },
    })
  } catch (error) {
    console.error("Error fetching order details:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id
    const body = await request.json()

    // If updating status, add to history
    if (body.status) {
      const currentOrder = await sql`
        SELECT status FROM orders WHERE id = ${orderId}
      `

      if (currentOrder.length > 0 && currentOrder[0].status !== body.status) {
        await sql`
          INSERT INTO order_status_history (order_id, status, description)
          VALUES (${orderId}, ${body.status}, ${`Status changed to ${body.status}`})
        `
      }
    }

    // Update order
    const updateFields = []
    const values = []
    let paramIndex = 1

    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined && key !== "id") {
        updateFields.push(`${key} = $${paramIndex}`)
        values.push(value)
        paramIndex++
      }
    })

    if (updateFields.length === 0) {
      return NextResponse.json({ success: false, error: "No fields to update" }, { status: 400 })
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(orderId)

    const query = `
      UPDATE orders 
      SET ${updateFields.join(", ")} 
      WHERE id = $${paramIndex}
      RETURNING *
    `

    const result = await sql(query, values)

    return NextResponse.json({
      success: true,
      data: result[0],
    })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    // Delete order (cascade will handle order_items and order_status_history)
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
    console.error("Error deleting order:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
