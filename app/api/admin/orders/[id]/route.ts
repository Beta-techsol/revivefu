import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id
    console.log("Fetching order details for ID:", orderId)

    // Validate the order ID
    if (!orderId || orderId === "[id]" || orderId === "undefined" || orderId === "null") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid order ID provided",
        },
        { status: 400 },
      )
    }

    // Check if orderId is a valid number
    const orderIdNum = Number.parseInt(orderId, 10)
    if (isNaN(orderIdNum)) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID must be a valid number",
        },
        { status: 400 },
      )
    }

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
      WHERE id = ${orderIdNum}
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

    // Get order items - use product price since order_items doesn't have price column
    const itemsResult = await sql`
      SELECT 
        oi.id,
        oi.product_id,
        oi.quantity,
        oi.created_at,
        p.name as product_name,
        p.sku as product_sku,
        p.price as product_price,
        p.images as product_images
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${orderIdNum}
      ORDER BY oi.created_at
    `

    // Process items to extract first image from images array and calculate totals
    const processedItems = itemsResult.map((item) => {
      let imageUrl = null

      // Handle images field - it might be JSON array or string
      if (item.product_images) {
        try {
          const images = typeof item.product_images === "string" ? JSON.parse(item.product_images) : item.product_images

          if (Array.isArray(images) && images.length > 0) {
            imageUrl = images[0]
          } else if (typeof images === "string") {
            imageUrl = images
          }
        } catch (e) {
          console.error("Error parsing product images:", e)
          // If it's a string that's not JSON, use it directly
          if (typeof item.product_images === "string") {
            imageUrl = item.product_images
          }
        }
      }

      const price = Number.parseFloat(item.product_price) || 0
      const quantity = Number.parseInt(item.quantity) || 0

      return {
        id: item.id,
        product_id: item.product_id,
        name: item.product_name || "Unknown Product",
        sku: item.product_sku || "N/A",
        quantity: quantity,
        price: price,
        total: price * quantity,
        image: imageUrl,
      }
    })

    // Get status history
    const statusHistoryResult = await sql`
      SELECT 
        id,
        status,
        description,
        created_at
      FROM order_status_history
      WHERE order_id = ${orderIdNum}
      ORDER BY created_at DESC
    `

    const response = NextResponse.json({
      success: true,
      data: {
        ...order,
        items: processedItems,
        history: statusHistoryResult,
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

    // Validate the order ID
    if (!orderId || orderId === "[id]" || orderId === "undefined" || orderId === "null") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid order ID provided",
        },
        { status: 400 },
      )
    }

    // Check if orderId is a valid number
    const orderIdNum = Number.parseInt(orderId, 10)
    if (isNaN(orderIdNum)) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID must be a valid number",
        },
        { status: 400 },
      )
    }

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
    const currentOrderResult = await sql`
      SELECT status FROM orders WHERE id = ${orderIdNum}
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

    const currentStatus = currentOrderResult[0].status

    // Update the order
    const updateResult = await sql`
      UPDATE orders 
      SET 
        customer_name = ${customer_name},
        customer_email = ${customer_email},
        customer_phone = ${customer_phone},
        customer_address = ${customer_address},
        customer_city = ${customer_city},
        customer_zip = ${customer_zip},
        customer_landmark = ${customer_landmark || null},
        special_instructions = ${special_instructions || null},
        status = ${status},
        updated_at = NOW()
      WHERE id = ${orderIdNum}
      RETURNING *
    `

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
        await sql`
          INSERT INTO order_status_history (order_id, status, description, created_at)
          VALUES (${orderIdNum}, ${status}, ${"Status updated by admin"}, NOW())
        `
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

    // Validate the order ID
    if (!orderId || orderId === "[id]" || orderId === "undefined" || orderId === "null") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid order ID provided",
        },
        { status: 400 },
      )
    }

    // Check if orderId is a valid number
    const orderIdNum = Number.parseInt(orderId, 10)
    if (isNaN(orderIdNum)) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID must be a valid number",
        },
        { status: 400 },
      )
    }

    // First delete order items
    await sql`DELETE FROM order_items WHERE order_id = ${orderIdNum}`

    // Delete status history
    await sql`DELETE FROM order_status_history WHERE order_id = ${orderIdNum}`

    // Finally delete the order
    const deleteResult = await sql`
      DELETE FROM orders 
      WHERE id = ${orderIdNum}
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
