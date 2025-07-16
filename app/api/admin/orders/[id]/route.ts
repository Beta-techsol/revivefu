import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    // Get order details
    const orderResult = await sql`
      SELECT * FROM orders WHERE id = ${orderId}
    `

    if (orderResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      )
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
      const currentOrder = await sql`SELECT status FROM orders WHERE id = ${orderId}`

      if (currentOrder.length > 0 && currentOrder[0].status !== body.status) {
        await sql`
          INSERT INTO order_status_history (order_id, status, description)
          VALUES (${orderId}, ${body.status}, ${`Status changed to ${body.status}`})
        `
      }
    }

    // Build update query dynamically
    const updateFields = []
    const values = []
    let paramIndex = 1

    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined && key !== "id") {
        updateFields.push(`${key} = $${paramIndex}`)
        values.push(value)
        paramIndex++
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No fields to update",
        },
        { status: 400 },
      )
    }

    const updateQuery = `
      UPDATE orders 
      SET ${updateFields.join(", ")}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING *
    `
    values.push(orderId)

    const result = await sql(updateQuery, values)

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

    // Delete order items first (foreign key constraint)
    await sql`DELETE FROM order_items WHERE order_id = ${orderId}`

    // Delete status history
    await sql`DELETE FROM order_status_history WHERE order_id = ${orderId}`

    // Delete order
    const result = await sql`DELETE FROM orders WHERE id = ${orderId} RETURNING *`

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      )
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
