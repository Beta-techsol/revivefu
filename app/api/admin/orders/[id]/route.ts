import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic"
export const revalidate = 0

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

    // Get order details
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

    // Get order items
    const itemsResult = await sql`
      SELECT * FROM order_items WHERE order_id = ${id}
    `

    // Get status history
    const historyResult = await sql`
      SELECT * FROM order_status_history 
      WHERE order_id = ${id} 
      ORDER BY created_at ASC
    `

    const response = NextResponse.json({
      success: true,
      data: {
        ...order,
        items: itemsResult,
        status_history: historyResult,
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
    const { id } = params
    const body = await request.json()

    console.log(`Updating order ${id} with data:`, body)

    const { customer_name, customer_email, customer_phone, customer_address, customer_city, customer_zip, status } =
      body

    // Update order
    const result = await sql`
      UPDATE orders 
      SET 
        customer_name = ${customer_name || null},
        customer_email = ${customer_email || null},
        customer_phone = ${customer_phone || null},
        customer_address = ${customer_address || null},
        customer_city = ${customer_city || null},
        customer_zip = ${customer_zip || null},
        status = ${status || null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found or update failed",
        },
        { status: 404 },
      )
    }

    // Add status history if status was updated
    if (status) {
      try {
        await sql`
          INSERT INTO order_status_history (order_id, status, description, created_at)
          VALUES (${id}, ${status}, ${"Status updated by admin"}, NOW())
        `
      } catch (historyError) {
        console.error("Error adding status history:", historyError)
      }
    }

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
    const { id } = params

    console.log(`Deleting order ${id}`)

    // Delete order items first (foreign key constraint)
    await sql`DELETE FROM order_items WHERE order_id = ${id}`

    // Delete status history
    await sql`DELETE FROM order_status_history WHERE order_id = ${id}`

    // Delete the order
    const result = await sql`DELETE FROM orders WHERE id = ${id} RETURNING *`

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
