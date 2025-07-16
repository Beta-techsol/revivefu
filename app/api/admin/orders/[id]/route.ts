import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id
    console.log("Fetching order details for ID:", orderId)

    // Get order details
    const orderResult = await sql`
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
        created_at,
        updated_at
      FROM orders 
      WHERE id = ${orderId}
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
      SELECT 
        oi.*,
        p.name as product_name,
        p.image_url as product_image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${orderId}
      ORDER BY oi.created_at
    `

    // Get status history
    const statusHistoryResult = await sql`
      SELECT 
        status,
        description,
        created_at
      FROM order_status_history
      WHERE order_id = ${orderId}
      ORDER BY created_at DESC
    `

    const response = NextResponse.json({
      success: true,
      data: {
        order,
        items: itemsResult,
        statusHistory: statusHistoryResult,
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
      subtotal,
      delivery_charge,
      total_amount,
    } = body

    // Build update query dynamically based on provided fields
    const updateFields = []
    const updateValues = []

    if (customer_name !== undefined) {
      updateFields.push("customer_name = $" + (updateValues.length + 1))
      updateValues.push(customer_name)
    }
    if (customer_email !== undefined) {
      updateFields.push("customer_email = $" + (updateValues.length + 1))
      updateValues.push(customer_email)
    }
    if (customer_phone !== undefined) {
      updateFields.push("customer_phone = $" + (updateValues.length + 1))
      updateValues.push(customer_phone)
    }
    if (customer_address !== undefined) {
      updateFields.push("customer_address = $" + (updateValues.length + 1))
      updateValues.push(customer_address)
    }
    if (customer_city !== undefined) {
      updateFields.push("customer_city = $" + (updateValues.length + 1))
      updateValues.push(customer_city)
    }
    if (customer_zip !== undefined) {
      updateFields.push("customer_zip = $" + (updateValues.length + 1))
      updateValues.push(customer_zip)
    }
    if (customer_landmark !== undefined) {
      updateFields.push("customer_landmark = $" + (updateValues.length + 1))
      updateValues.push(customer_landmark)
    }
    if (special_instructions !== undefined) {
      updateFields.push("special_instructions = $" + (updateValues.length + 1))
      updateValues.push(special_instructions)
    }
    if (status !== undefined) {
      updateFields.push("status = $" + (updateValues.length + 1))
      updateValues.push(status)
    }
    if (subtotal !== undefined) {
      updateFields.push("subtotal = $" + (updateValues.length + 1))
      updateValues.push(subtotal)
    }
    if (delivery_charge !== undefined) {
      updateFields.push("delivery_charge = $" + (updateValues.length + 1))
      updateValues.push(delivery_charge)
    }
    if (total_amount !== undefined) {
      updateFields.push("total_amount = $" + (updateValues.length + 1))
      updateValues.push(total_amount)
    }

    // Always update the updated_at field
    updateFields.push("updated_at = NOW()")

    if (updateFields.length === 1) {
      // Only updated_at
      return NextResponse.json(
        {
          success: false,
          error: "No fields to update",
        },
        { status: 400 },
      )
    }

    // Execute update
    const updateQuery = `
      UPDATE orders 
      SET ${updateFields.join(", ")}
      WHERE id = $${updateValues.length + 1}
      RETURNING *
    `

    updateValues.push(orderId)
    const updateResult = await sql.unsafe(updateQuery, updateValues)

    if (updateResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found or update failed",
        },
        { status: 404 },
      )
    }

    // Add status history if status was updated
    if (status !== undefined) {
      try {
        await sql`
          INSERT INTO order_status_history (order_id, status, description, created_at)
          VALUES (${orderId}, ${status}, ${"Status updated by admin"}, NOW())
        `
      } catch (historyError) {
        console.error("Error adding status history:", historyError)
      }
    }

    const updatedOrder = updateResult[0]
    console.log("Order updated successfully:", updatedOrder)

    return NextResponse.json({
      success: true,
      data: updatedOrder,
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
    await sql`DELETE FROM order_items WHERE order_id = ${orderId}`

    // Delete status history
    await sql`DELETE FROM order_status_history WHERE order_id = ${orderId}`

    // Finally delete the order
    const deleteResult = await sql`
      DELETE FROM orders 
      WHERE id = ${orderId}
      RETURNING *
    `

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
