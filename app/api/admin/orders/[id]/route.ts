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
    const items = await sql`
      SELECT * FROM order_items WHERE order_id = ${orderId}
    `

    // Get status history
    const history = await sql`
      SELECT * FROM order_status_history 
      WHERE order_id = ${orderId} 
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        items,
        history,
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

    // Check if order exists
    const existingOrder = await sql`
      SELECT * FROM orders WHERE id = ${orderId}
    `

    if (existingOrder.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      )
    }

    // Update order
    const updateFields = []
    const updateValues = []
    let paramIndex = 1

    if (body.customer_name) {
      updateFields.push(`customer_name = $${paramIndex}`)
      updateValues.push(body.customer_name)
      paramIndex++
    }
    if (body.customer_email) {
      updateFields.push(`customer_email = $${paramIndex}`)
      updateValues.push(body.customer_email)
      paramIndex++
    }
    if (body.customer_phone) {
      updateFields.push(`customer_phone = $${paramIndex}`)
      updateValues.push(body.customer_phone)
      paramIndex++
    }
    if (body.customer_address) {
      updateFields.push(`customer_address = $${paramIndex}`)
      updateValues.push(body.customer_address)
      paramIndex++
    }
    if (body.customer_city) {
      updateFields.push(`customer_city = $${paramIndex}`)
      updateValues.push(body.customer_city)
      paramIndex++
    }
    if (body.customer_zip) {
      updateFields.push(`customer_zip = $${paramIndex}`)
      updateValues.push(body.customer_zip)
      paramIndex++
    }
    if (body.status) {
      updateFields.push(`status = $${paramIndex}`)
      updateValues.push(body.status)
      paramIndex++
    }

    // Always update the updated_at timestamp
    updateFields.push(`updated_at = $${paramIndex}`)
    updateValues.push(new Date().toISOString())
    paramIndex++

    if (updateFields.length === 1) {
      // Only updated_at was added
      return NextResponse.json(
        {
          success: false,
          error: "No fields to update",
        },
        { status: 400 },
      )
    }

    // Build and execute update query
    const updateQuery = `
      UPDATE orders 
      SET ${updateFields.join(", ")} 
      WHERE id = $${paramIndex} 
      RETURNING *
    `
    updateValues.push(orderId)

    const updatedOrder = await sql(updateQuery, updateValues)

    // If status was updated, add to status history
    if (body.status) {
      await sql`
        INSERT INTO order_status_history (order_id, status, description, created_at)
        VALUES (${orderId}, ${body.status}, ${"Status updated by admin"}, ${new Date().toISOString()})
      `
    }

    console.log("Order updated successfully:", updatedOrder[0])

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

    // Check if order exists
    const existingOrder = await sql`
      SELECT * FROM orders WHERE id = ${orderId}
    `

    if (existingOrder.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      )
    }

    // Delete order items first (foreign key constraint)
    await sql`
      DELETE FROM order_items WHERE order_id = ${orderId}
    `

    // Delete status history
    await sql`
      DELETE FROM order_status_history WHERE order_id = ${orderId}
    `

    // Delete the order
    await sql`
      DELETE FROM orders WHERE id = ${orderId}
    `

    console.log("Order deleted successfully:", orderId)

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
