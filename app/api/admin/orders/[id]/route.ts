import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID is required",
        },
        { status: 400 },
      )
    }

    console.log(`Fetching order details for ID: ${id}`)

    const orderResult = await sql`
      SELECT * FROM orders WHERE id = ${id}
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
        status_history: historyResult,
      },
    })
  } catch (error) {
    console.error("Error fetching order details:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order details",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    console.log(`Updating order ${id} with data:`, body)

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID is required",
        },
        { status: 400 },
      )
    }

    // Get current order to check if status is changing
    const currentOrderResult = await sql`
      SELECT * FROM orders WHERE id = ${id}
    `

    if (currentOrderResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      )
    }

    const currentOrder = currentOrderResult[0]
    const isStatusChange = body.status && body.status !== currentOrder.status

    // Build update query dynamically
    const updateFields = []
    const updateValues = []

    if (body.customer_name) {
      updateFields.push("customer_name = $" + (updateValues.length + 1))
      updateValues.push(body.customer_name)
    }
    if (body.customer_email) {
      updateFields.push("customer_email = $" + (updateValues.length + 1))
      updateValues.push(body.customer_email)
    }
    if (body.customer_phone) {
      updateFields.push("customer_phone = $" + (updateValues.length + 1))
      updateValues.push(body.customer_phone)
    }
    if (body.customer_address) {
      updateFields.push("customer_address = $" + (updateValues.length + 1))
      updateValues.push(body.customer_address)
    }
    if (body.customer_city) {
      updateFields.push("customer_city = $" + (updateValues.length + 1))
      updateValues.push(body.customer_city)
    }
    if (body.customer_zip) {
      updateFields.push("customer_zip = $" + (updateValues.length + 1))
      updateValues.push(body.customer_zip)
    }
    if (body.status) {
      updateFields.push("status = $" + (updateValues.length + 1))
      updateValues.push(body.status)
    }

    // Always update the updated_at field
    updateFields.push("updated_at = NOW()")

    if (updateFields.length === 1) {
      // Only updated_at field, no actual changes
      return NextResponse.json(
        {
          success: false,
          error: "No fields to update",
        },
        { status: 400 },
      )
    }

    // Update the order
    const updateQuery = `
      UPDATE orders 
      SET ${updateFields.join(", ")} 
      WHERE id = $${updateValues.length + 1} 
      RETURNING *
    `

    updateValues.push(id)
    const updatedOrderResult = await sql.unsafe(updateQuery, updateValues)

    if (updatedOrderResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update order",
        },
        { status: 500 },
      )
    }

    const updatedOrder = updatedOrderResult[0]

    // Add status history if status changed
    if (isStatusChange) {
      try {
        await sql`
          INSERT INTO order_status_history (order_id, status, description, created_at)
          VALUES (${id}, ${body.status}, ${"Status updated by admin"}, NOW())
        `
        console.log(`Added status history for order ${id}: ${body.status}`)
      } catch (historyError) {
        console.error("Error adding status history:", historyError)
        // Don't fail the entire request if history fails
      }
    }

    // Revalidate relevant paths to ensure fresh data
    try {
      // Revalidate admin orders page
      revalidatePath("/admin/orders")

      // Revalidate track order page for this specific order
      revalidatePath(`/track-order`)
      revalidatePath(`/track-order/${updatedOrder.order_number}`)

      // Revalidate account orders page
      revalidatePath("/account/orders")

      console.log(`Revalidated paths for order ${id}`)
    } catch (revalidateError) {
      console.error("Error revalidating paths:", revalidateError)
      // Don't fail the request if revalidation fails
    }

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
    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID is required",
        },
        { status: 400 },
      )
    }

    console.log(`Deleting order ${id}`)

    // Get order details before deletion for revalidation
    const orderResult = await sql`
      SELECT order_number FROM orders WHERE id = ${id}
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

    const orderNumber = orderResult[0].order_number

    // Delete order items first (foreign key constraint)
    await sql`
      DELETE FROM order_items WHERE order_id = ${id}
    `

    // Delete status history
    await sql`
      DELETE FROM order_status_history WHERE order_id = ${id}
    `

    // Delete the order
    const deleteResult = await sql`
      DELETE FROM orders WHERE id = ${id} RETURNING *
    `

    if (deleteResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to delete order",
        },
        { status: 500 },
      )
    }

    // Revalidate relevant paths
    try {
      revalidatePath("/admin/orders")
      revalidatePath(`/track-order`)
      revalidatePath(`/track-order/${orderNumber}`)
      revalidatePath("/account/orders")

      console.log(`Revalidated paths after deleting order ${id}`)
    } catch (revalidateError) {
      console.error("Error revalidating paths after deletion:", revalidateError)
    }

    console.log("Order deleted successfully")

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
