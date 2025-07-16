import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const orderResult = await sql`
      SELECT * FROM orders WHERE id = ${id}
    `

    if (orderResult.length === 0) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    const order = orderResult[0]

    const itemsResult = await sql`
      SELECT * FROM order_items WHERE order_id = ${id}
    `

    const historyResult = await sql`
      SELECT * FROM order_status_history 
      WHERE order_id = ${id} 
      ORDER BY created_at ASC
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
    console.error("Error fetching order:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    // Status only update
    if (body.status && Object.keys(body).length === 1) {
      const updatedOrderResult = await sql`
        UPDATE orders 
        SET status = ${body.status}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `

      if (updatedOrderResult.length > 0) {
        // Add status history
        await sql`
          INSERT INTO order_status_history (order_id, status, description, created_at)
          VALUES (${id}, ${body.status}, ${"Status updated by admin"}, NOW())
        `

        return NextResponse.json({
          success: true,
          data: updatedOrderResult[0],
        })
      }
    }

    // Full update
    const existingOrderResult = await sql`
      SELECT * FROM orders WHERE id = ${id}
    `

    if (existingOrderResult.length === 0) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    const existingOrder = existingOrderResult[0]

    const {
      customer_name = existingOrder.customer_name,
      customer_email = existingOrder.customer_email,
      customer_phone = existingOrder.customer_phone,
      customer_address = existingOrder.customer_address,
      customer_city = existingOrder.customer_city,
      customer_zip = existingOrder.customer_zip,
      customer_landmark = existingOrder.customer_landmark,
      special_instructions = existingOrder.special_instructions,
      status = existingOrder.status,
    } = body

    const updatedOrderResult = await sql`
      UPDATE orders 
      SET 
        customer_name = ${customer_name},
        customer_email = ${customer_email},
        customer_phone = ${customer_phone},
        customer_address = ${customer_address},
        customer_city = ${customer_city},
        customer_zip = ${customer_zip},
        customer_landmark = ${customer_landmark},
        special_instructions = ${special_instructions},
        status = ${status},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (updatedOrderResult.length > 0) {
      if (status !== existingOrder.status) {
        await sql`
          INSERT INTO order_status_history (order_id, status, description, created_at)
          VALUES (${id}, ${status}, ${"Order updated by admin"}, NOW())
        `
      }

      return NextResponse.json({
        success: true,
        data: updatedOrderResult[0],
      })
    }

    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update order",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await sql`DELETE FROM order_items WHERE order_id = ${id}`
    await sql`DELETE FROM order_status_history WHERE order_id = ${id}`

    const deletedOrderResult = await sql`
      DELETE FROM orders WHERE id = ${id} RETURNING *
    `

    if (deletedOrderResult.length > 0) {
      return NextResponse.json({
        success: true,
        data: deletedOrderResult[0],
      })
    }

    return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
  } catch (error) {
    console.error("Error deleting order:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete order",
      },
      { status: 500 },
    )
  }
}
