import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { calculatePaymentBreakdown } from "@/lib/payment-utils"
import { ensureOrderSchemaColumns, extractFirstImage, parseVariantInfo } from "@/lib/order-schema"

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureOrderSchemaColumns()
    const orderId = params.id

    if (!orderId || orderId === "[id]" || orderId === "undefined" || orderId === "null") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid order ID provided",
        },
        { status: 400 },
      )
    }

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
        advance_amount,
        remaining_amount,
        status,
        payment_status,
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

    const itemsResult = await sql`
      SELECT 
        oi.*,
        p.name as db_product_name,
        p.sku as product_sku,
        p.price as db_product_price,
        p.images as product_images
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${orderIdNum}
      ORDER BY oi.created_at ASC, oi.id ASC
    `

    const processedItems = itemsResult.map((item: any) => {
      const imageUrl = item.product_image || extractFirstImage(item.product_images)
      const price =
        Number.parseFloat(item.unit_price ?? item.price ?? item.db_product_price ?? 0) || 0
      const quantity = Number.parseInt(item.quantity, 10) || 0
      const total =
        Number.parseFloat(item.total_price ?? item.total ?? price * quantity) || price * quantity

      return {
        id: item.id,
        product_id: item.product_id,
        name: item.product_name || item.db_product_name || "Unknown Product",
        sku: item.product_sku || "N/A",
        quantity,
        price,
        total,
        image: imageUrl,
        variation: parseVariantInfo(item.variant_info),
      }
    })

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

    const breakdown = calculatePaymentBreakdown(order.total_amount)
    const advanceAmount =
      order.advance_amount !== null && order.advance_amount !== undefined && Number(order.advance_amount) > 0
        ? Number(order.advance_amount)
        : breakdown.advanceAmount
    const remainingAmount =
      order.remaining_amount !== null && order.remaining_amount !== undefined && Number(order.remaining_amount) >= 0
        ? Number(order.remaining_amount)
        : breakdown.remainingAmount

    const response = NextResponse.json({
      success: true,
      data: {
        ...order,
        advance_amount: advanceAmount,
        remaining_amount: remainingAmount,
        payment_status: order.payment_status || "pending",
        items: processedItems,
        history: statusHistoryResult,
      },
    })

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
    await ensureOrderSchemaColumns()
    const orderId = params.id
    const body = await request.json()

    if (!orderId || orderId === "[id]" || orderId === "undefined" || orderId === "null") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid order ID provided",
        },
        { status: 400 },
      )
    }

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
      payment_status,
    } = body

    const currentOrderResult = await sql`
      SELECT status, payment_status FROM orders WHERE id = ${orderIdNum}
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
    const nextPaymentStatus = payment_status ?? currentOrderResult[0].payment_status ?? "pending"

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
        payment_status = ${nextPaymentStatus},
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

    if (status && status !== currentStatus) {
      try {
        await sql`
          INSERT INTO order_status_history (order_id, status, description, created_at)
          VALUES (${orderIdNum}, ${status}, ${`Order status updated to ${status}`}, NOW())
        `
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

    if (!orderId || orderId === "[id]" || orderId === "undefined" || orderId === "null") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid order ID provided",
        },
        { status: 400 },
      )
    }

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

    await sql`DELETE FROM order_items WHERE order_id = ${orderIdNum}`
    await sql`DELETE FROM order_status_history WHERE order_id = ${orderIdNum}`

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
