import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import {
  PAYMENT_METHOD_CODE,
  calculatePaymentBreakdown,
  formatPKR,
  formatPaymentMethodLabel,
} from "@/lib/payment-utils"
import { ensureOrderSchemaColumns, extractFirstImage, parseVariantInfo } from "@/lib/order-schema"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: { orderNumber: string } },
) {
  try {
    await ensureOrderSchemaColumns()
    const rawOrderNumber = params?.orderNumber ? decodeURIComponent(params.orderNumber).trim() : ""

    if (!rawOrderNumber) {
      return NextResponse.json(
        { success: false, error: "Order number is required" },
        { status: 400 },
      )
    }

    const { searchParams } = new URL(request.url)
    const emailFilter = searchParams.get("email")?.trim() || ""

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
      WHERE LOWER(order_number) = LOWER(${rawOrderNumber})
      LIMIT 1
    `

    if (orderResult.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order not found. Please check your Order ID and try again." },
        { status: 404 },
      )
    }

    const order = orderResult[0]

    // Enforce exact match when an email filter is supplied (e.g. from /account/track-order)
    if (
      emailFilter &&
      String(order.customer_email || "").trim().toLowerCase() !== emailFilter.toLowerCase()
    ) {
      return NextResponse.json(
        { success: false, error: "No order found matching that Order ID and email address." },
        { status: 404 },
      )
    }

    // Fetch order items with fallback columns across schemas
    const itemsResult = await sql`
      SELECT 
        oi.*,
        p.name as db_product_name,
        p.images as product_images,
        p.price as db_product_price
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${order.id}
      ORDER BY oi.id ASC
    `

    const processedItems = itemsResult.map((item: any) => {
      const imageUrl = item.product_image || extractFirstImage(item.product_images)
      const quantity = Math.max(1, Number(item.quantity) || 1)
      const unitPrice =
        Number(item.unit_price ?? item.price ?? item.db_product_price ?? 0) || 0
      const totalPrice =
        Number(item.total_price ?? item.total ?? unitPrice * quantity) || unitPrice * quantity

      return {
        id: item.id,
        product_id: item.product_id ?? null,
        product_name: item.product_name || item.db_product_name || "Furniture Item",
        quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
        product_image: imageUrl,
        variation: parseVariantInfo(item.variant_info),
      }
    })

    // Compute authoritative financial breakdown
    const itemsSubtotal = processedItems.reduce((sum: number, item: any) => sum + item.total_price, 0)
    const numericTotal = Number(order.total_amount) || 0
    const subtotalNum =
      order.subtotal !== null && order.subtotal !== undefined && Number(order.subtotal) > 0
        ? Number(order.subtotal)
        : itemsSubtotal > 0
          ? itemsSubtotal
          : numericTotal
    const deliveryChargeNum =
      order.delivery_charge !== null && order.delivery_charge !== undefined
        ? Number(order.delivery_charge) || 0
        : Math.max(0, numericTotal - subtotalNum)
    const effectiveTotal = numericTotal > 0 ? numericTotal : subtotalNum + deliveryChargeNum

    const calculatedSplit = calculatePaymentBreakdown(effectiveTotal)
    const storedAdvance = Number(order.advance_amount)
    const storedRemaining = Number(order.remaining_amount)
    const hasValidStoredSplit =
      Number.isFinite(storedAdvance) &&
      Number.isFinite(storedRemaining) &&
      storedAdvance > 0 &&
      Math.abs(storedAdvance + storedRemaining - effectiveTotal) < 0.01

    const advanceAmount = hasValidStoredSplit ? storedAdvance : calculatedSplit.advanceAmount
    const remainingAmount = hasValidStoredSplit ? storedRemaining : calculatedSplit.remainingAmount

    // Fetch status history
    const statusHistoryResult = await sql`
      SELECT 
        status,
        description,
        created_at
      FROM order_status_history
      WHERE order_id = ${order.id}
      ORDER BY created_at ASC
    `

    let statusHistory: any[] = []

    if (statusHistoryResult.length > 0) {
      statusHistory = statusHistoryResult.map((item: any) => ({
        status: item.status,
        timestamp: item.created_at,
        description: item.description || `Order ${item.status}`,
        location: "Revive Furniture",
        created_at: item.created_at,
      }))
    } else {
      const orderDate = new Date(order.created_at)
      statusHistory.push({
        status: "pending",
        timestamp: orderDate.toISOString(),
        description: "Order placed. Awaiting 50% advance payment verification.",
        location: "Online Store",
        created_at: orderDate.toISOString(),
      })

      if (["processing", "shipped", "out_for_delivery", "delivered"].includes(order.status)) {
        statusHistory.push({
          status: "processing",
          timestamp: new Date(orderDate.getTime() + 2 * 60 * 60 * 1000).toISOString(),
          description: "Order is being prepared for shipment",
          location: "Fulfillment Center",
          created_at: new Date(orderDate.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        })
      }

      if (["shipped", "out_for_delivery", "delivered"].includes(order.status)) {
        statusHistory.push({
          status: "shipped",
          timestamp: new Date(orderDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
          description: "Package shipped",
          location: "Distribution Center",
          created_at: new Date(orderDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        })
      }

      if (["out_for_delivery", "delivered"].includes(order.status)) {
        statusHistory.push({
          status: "out_for_delivery",
          timestamp: new Date(orderDate.getTime() + 48 * 60 * 60 * 1000).toISOString(),
          description: "Out for delivery",
          location: "Local Delivery Hub",
          created_at: new Date(orderDate.getTime() + 48 * 60 * 60 * 1000).toISOString(),
        })
      }

      if (order.status === "delivered") {
        statusHistory.push({
          status: "delivered",
          timestamp: new Date(orderDate.getTime() + 72 * 60 * 60 * 1000).toISOString(),
          description: "Package delivered",
          location: "Customer Address",
          created_at: new Date(orderDate.getTime() + 72 * 60 * 60 * 1000).toISOString(),
        })
      }
    }

    const trackingData = {
      id: order.id,
      order_number: order.order_number,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      customer_address: order.customer_address,
      customer_city: order.customer_city,
      customer_zip: order.customer_zip,
      customer_landmark: order.customer_landmark,
      special_instructions: order.special_instructions,
      subtotal: subtotalNum,
      delivery_charge: deliveryChargeNum,
      total_amount: formatPKR(effectiveTotal),
      total_amount_num: effectiveTotal,
      advance_amount: advanceAmount,
      remaining_amount: remainingAmount,
      payment_method: order.payment_method || PAYMENT_METHOD_CODE,
      payment_method_label: formatPaymentMethodLabel(order.payment_method || PAYMENT_METHOD_CODE),
      payment_status: order.payment_status || "pending",
      status: order.status,
      created_at: order.created_at,
      updated_at: order.updated_at,
      status_history: statusHistory,
      items: processedItems,
    }

    const response = NextResponse.json({
      success: true,
      data: trackingData,
    })

    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")

    return response
  } catch (error) {
    console.error("Error tracking order:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to track order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
