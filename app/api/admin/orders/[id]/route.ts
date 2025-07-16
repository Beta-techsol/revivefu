import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id
    console.log("Fetching order details for ID:", orderId)

    // Get order details
    const orderQuery = `
      SELECT 
        id,
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        customer_city,
        customer_zip,
        customer_landmark,
        special_instructions,
        subtotal,
        delivery_charge,
        total_amount,
        status,
        payment_method,
        payment_status,
        created_at,
        updated_at
      FROM orders 
      WHERE id = $1
    `

    const orderResult = await sql(orderQuery, [orderId])

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
    const itemsQuery = `
      SELECT 
        id,
        name,
        sku,
        quantity,
        price,
        product_id
      FROM order_items
      WHERE order_id = $1
      ORDER BY created_at
    `

    const itemsResult = await sql(itemsQuery, [orderId])

    // Get status history if exists
    let statusHistory = []
    try {
      const historyQuery = `
        SELECT 
          id,
          status,
          description,
          created_at
        FROM order_status_history
        WHERE order_id = $1
        ORDER BY created_at DESC
      `
      statusHistory = await sql(historyQuery, [orderId])
    } catch (historyError) {
      console.log("No status history table or data:", historyError)
    }

    const response = NextResponse.json({
      success: true,
      data: {
        ...order,
        items: itemsResult,
        history: statusHistory,
      },
    })

    // Add cache control headers
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")

    return response
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
    console.log("Updating order:", orderId, "with data:", body)

    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      customer_city,
      customer_zip,
      customer_landmark,
      special_instructions,
      status,
    } = body

    // Get current order to check if status changed
    const currentOrderQuery = `SELECT status FROM orders WHERE id = $1`
    const currentOrderResult = await sql(currentOrderQuery, [orderId])

    if (currentOrderResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      )
    }

    const currentStatus = currentOrderResult[0].status

    // Update the order
    const updateQuery = `
      UPDATE orders 
      SET 
        customer_name = $1,
        customer_email = $2,
        customer_phone = $3,
        customer_address = $4,
        customer_city = $5,
        customer_zip = $6,
        customer_landmark = $7,
        special_instructions = $8,
        status = $9,
        updated_at = NOW()
      WHERE id = $10
      RETURNING *
    `

    const updateResult = await sql(updateQuery, [
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      customer_city,
      customer_zip,
      customer_landmark || null,
      special_instructions || null,
      status,
      orderId,
    ])

    if (updateResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update order",
        },
        { status: 500 },
      )
    }

    const updatedOrder = updateResult[0]
    console.log("Order updated successfully:", updatedOrder)

    // Add status history if status changed
    if (status && status !== currentStatus) {
      try {
        const historyQuery = `
          INSERT INTO order_status_history (order_id, status, description, created_at)
          VALUES ($1, $2, $3, NOW())
        `
        await sql(historyQuery, [orderId, status, "Status updated by admin"])
        console.log("Status history added for status change:", currentStatus, "->", status)
      } catch (historyError) {
        console.error("Error adding status history:", historyError)
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: "Order updated successfully",
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
    console.log("Deleting order:", orderId)

    // First delete order items
    const deleteItemsQuery = `DELETE FROM order_items WHERE order_id = $1`
    await sql(deleteItemsQuery, [orderId])

    // Delete status history if exists
    try {
      const deleteHistoryQuery = `DELETE FROM order_status_history WHERE order_id = $1`
      await sql(deleteHistoryQuery, [orderId])
    } catch (historyError) {
      console.log("No status history to delete:", historyError)
    }

    // Finally delete the order
    const deleteOrderQuery = `DELETE FROM orders WHERE id = $1 RETURNING *`
    const deleteResult = await sql(deleteOrderQuery, [orderId])

    if (deleteResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      )
    }

    console.log("Order deleted successfully:", deleteResult[0])

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
