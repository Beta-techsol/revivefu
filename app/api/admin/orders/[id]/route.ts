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
    const items = await sql`
      SELECT * FROM order_items WHERE order_id = ${orderId}
    `

    // Get status history
    const statusHistory = await sql`
      SELECT * FROM order_status_history 
      WHERE order_id = ${orderId}
      ORDER BY created_at ASC
    `

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        items,
        status_history: statusHistory,
      },
    })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order",
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
    const { status, ...updateData } = body

    // First check if order exists
    const existingOrder = await sql`
      SELECT * FROM orders WHERE id = ${orderId}
    `

    if (existingOrder.length === 0) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    // Update order data (excluding status for now)
    if (Object.keys(updateData).length > 0) {
      const updateFields = Object.keys(updateData)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(", ")

      const updateValues = Object.values(updateData)

      await sql(
        `
        UPDATE orders 
        SET ${updateFields}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `,
        [orderId, ...updateValues],
      )
    }

    // If status is being updated, handle it separately
    if (status && status !== existingOrder[0].status) {
      await sql`
        UPDATE orders SET status = ${status}, updated_at = CURRENT_TIMESTAMP WHERE id = ${orderId}
      `

      await sql`
        INSERT INTO order_status_history (order_id, status, description)
        VALUES (${orderId}, ${status}, ${`Status updated to ${status}`})
      `
    }

    // Get updated order
    const updatedOrder = await sql`
      SELECT * FROM orders WHERE id = ${orderId}
    `

    return NextResponse.json({
      success: true,
      data: updatedOrder[0],
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

    const deleteResult = await sql`
      DELETE FROM orders WHERE id = ${orderId} RETURNING *
    `

    if (deleteResult.length === 0) {
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
