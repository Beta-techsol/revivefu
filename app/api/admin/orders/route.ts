import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import {
  PAYMENT_METHOD_CODE,
  calculateDeliveryCharge,
  calculatePaymentBreakdown,
} from "@/lib/payment-utils"
import { ensureOrderSchemaColumns, extractFirstImage } from "@/lib/order-schema"

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    await ensureOrderSchemaColumns()
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const whereConditions: string[] = []

    if (status && status !== "all") {
      whereConditions.push(`status = '${status.replace(/'/g, "''")}'`)
    }

    if (search) {
      const searchTerm = search.replace(/'/g, "''")
      whereConditions.push(`(
        order_number ILIKE '%${searchTerm}%' OR 
        customer_name ILIKE '%${searchTerm}%' OR 
        customer_email ILIKE '%${searchTerm}%'
      )`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""
    const offset = (page - 1) * limit

    let totalQuery = `SELECT COUNT(*) as total FROM orders`
    if (whereClause) {
      totalQuery += ` ${whereClause}`
    }

    const countResult = await sql.unsafe(totalQuery)
    const total = Number.parseInt(countResult[0]?.total) || 0

    let ordersQuery = `
      SELECT 
        id,
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        customer_city,
        customer_zip,
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
    `

    if (whereClause) {
      ordersQuery += ` ${whereClause}`
    }

    ordersQuery += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`

    const orders = await sql.unsafe(ordersQuery)

    const ordersWithItems = await Promise.all(
      orders.map(async (order: any) => {
        try {
          const itemsResult = await sql`
            SELECT COUNT(*) as item_count, COALESCE(SUM(quantity), 0) as total_items
            FROM order_items 
            WHERE order_id = ${order.id}
          `
          const breakdown = calculatePaymentBreakdown(order.total_amount)
          return {
            ...order,
            advance_amount: order.advance_amount ?? breakdown.advanceAmount,
            remaining_amount: order.remaining_amount ?? breakdown.remainingAmount,
            payment_status: order.payment_status || "pending",
            item_count: Number.parseInt(itemsResult[0]?.item_count) || 0,
            total_items: Number.parseInt(itemsResult[0]?.total_items) || 0,
          }
        } catch (error) {
          console.error(`Error getting items for order ${order.id}:`, error)
          return {
            ...order,
            item_count: 0,
            total_items: 0,
          }
        }
      }),
    )

    const response = NextResponse.json({
      success: true,
      data: {
        orders: ordersWithItems,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    })

    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")

    return response
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

interface ResolvedOrderItem {
  productId: number | null
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  productImage: string | null
  variantInfo: string | null
}

async function resolveIncomingItems(rawItems: any[]): Promise<ResolvedOrderItem[]> {
  const resolved: ResolvedOrderItem[] = []

  for (const raw of rawItems) {
    const qty = Math.max(1, Math.floor(Number(raw?.quantity) || 1))
    const rawId = raw?.id ?? raw?.product_id ?? ""
    const rawSku = typeof raw?.sku === "string" ? raw.sku.trim() : ""
    const rawName = typeof raw?.name === "string" ? raw.name.trim() : typeof raw?.product_name === "string" ? raw.product_name.trim() : ""
    const clientPrice = Number(raw?.price ?? raw?.unit_price)
    const clientImage = typeof raw?.image === "string" && raw.image.trim() ? raw.image.trim() : null
    const variantParts = [raw?.color, raw?.variant].filter((v) => typeof v === "string" && v.trim() && v !== "Default")
    const variantInfo = variantParts.length > 0 ? variantParts.join(" • ") : null

    let dbProduct: any = null
    try {
      const numericId = Number(rawId)
      if (Number.isInteger(numericId) && numericId > 0 && String(rawId).trim() === String(numericId)) {
        const res = await sql`SELECT id, name, price, images FROM products WHERE id = ${numericId} LIMIT 1`
        if (res.length > 0) dbProduct = res[0]
      }
      if (!dbProduct && typeof rawId === "string" && rawId.trim().length > 0) {
        const slugVal = rawId.trim()
        const res = await sql`SELECT id, name, price, images FROM products WHERE slug = ${slugVal} LIMIT 1`
        if (res.length > 0) dbProduct = res[0]
      }
      if (!dbProduct && rawSku) {
        const res = await sql`SELECT id, name, price, images FROM products WHERE sku = ${rawSku} LIMIT 1`
        if (res.length > 0) dbProduct = res[0]
      }
    } catch (lookupErr) {
      console.warn("Product lookup warning during order creation:", lookupErr)
    }

    const authoritativePrice =
      dbProduct && Number.isFinite(Number(dbProduct.price)) && Number(dbProduct.price) > 0
        ? Number(dbProduct.price)
        : Number.isFinite(clientPrice) && clientPrice >= 0
          ? clientPrice
          : 0

    const authoritativeName = dbProduct?.name || rawName || "Furniture Item"
    const authoritativeImage = extractFirstImage(dbProduct?.images) || clientImage

    resolved.push({
      productId: dbProduct ? Number(dbProduct.id) : null,
      productName: authoritativeName,
      quantity: qty,
      unitPrice: authoritativePrice,
      totalPrice: Math.round(authoritativePrice * qty * 100) / 100,
      productImage: authoritativeImage,
      variantInfo,
    })
  }

  return resolved
}

export async function POST(request: NextRequest) {
  try {
    await ensureOrderSchemaColumns()
    const body = await request.json()

    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      customer_city,
      customer_zip,
      customer_landmark,
      special_instructions,
      items,
      subtotal: rawSubtotal,
      delivery_charge: rawDeliveryCharge,
      total_amount: rawTotalAmount,
      payment_method,
    } = body

    if (!customer_name || !customer_email || !customer_phone || !customer_address) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: customer_name, customer_email, customer_phone, customer_address",
        },
        { status: 400 },
      )
    }

    const incomingItems = Array.isArray(items) ? items : []
    const resolvedItems = incomingItems.length > 0 ? await resolveIncomingItems(incomingItems) : []

    let subtotal = 0
    let deliveryCharge = 0
    let totalAmount = 0

    if (resolvedItems.length > 0) {
      subtotal = resolvedItems.reduce((sum, item) => sum + item.totalPrice, 0)
      subtotal = Math.round(subtotal * 100) / 100
      deliveryCharge = calculateDeliveryCharge(subtotal)
      totalAmount = Math.round((subtotal + deliveryCharge) * 100) / 100
    } else {
      subtotal = Math.max(0, Number(rawSubtotal) || 0)
      deliveryCharge = Math.max(0, Number(rawDeliveryCharge) || 0)
      totalAmount = Math.max(0, Number(rawTotalAmount) || subtotal + deliveryCharge)
    }

    const paymentBreakdown = calculatePaymentBreakdown(totalAmount)
    const orderPaymentMethod =
      typeof payment_method === "string" && payment_method.trim().length > 0
        ? payment_method.trim()
        : PAYMENT_METHOD_CODE

    // Order always starts pending with advance payment pending verification
    const initialStatus = "pending"
    const initialPaymentStatus = "pending"

    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    const orderResult = await sql`
      INSERT INTO orders (
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
      ) VALUES (
        ${orderNumber},
        ${String(customer_name).trim()},
        ${String(customer_email).trim()},
        ${String(customer_phone).trim()},
        ${String(customer_address).trim()},
        ${String(customer_city || "").trim()},
        ${String(customer_zip || "").trim()},
        ${String(customer_landmark || "").trim()},
        ${String(special_instructions || "").trim()},
        ${subtotal},
        ${deliveryCharge},
        ${totalAmount},
        ${paymentBreakdown.advanceAmount},
        ${paymentBreakdown.remainingAmount},
        ${initialStatus},
        ${initialPaymentStatus},
        ${orderPaymentMethod},
        NOW(),
        NOW()
      ) RETURNING *
    `

    if (orderResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create order",
        },
        { status: 500 },
      )
    }

    const newOrder = orderResult[0]

    // Persist every ordered item cleanly into order_items
    const savedItems: any[] = []
    for (const item of resolvedItems) {
      try {
        const itemRows = await sql`
          INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            quantity,
            unit_price,
            total_price,
            product_image,
            variant_info,
            created_at
          ) VALUES (
            ${newOrder.id},
            ${item.productId},
            ${item.productName},
            ${item.quantity},
            ${item.unitPrice},
            ${item.totalPrice},
            ${item.productImage},
            ${item.variantInfo},
            NOW()
          ) RETURNING *
        `
        savedItems.push(itemRows[0] || item)
      } catch (itemError) {
        console.error("Error inserting order item:", itemError)
      }
    }

    // Add initial status history
    try {
      await sql`
        INSERT INTO order_status_history (order_id, status, description, created_at)
        VALUES (
          ${newOrder.id},
          ${"pending"},
          ${"Order placed. Awaiting 50% advance payment screenshot verification."},
          NOW()
        )
      `
    } catch (historyError) {
      console.error("Error adding initial status history:", historyError)
    }

    return NextResponse.json({
      success: true,
      data: {
        ...newOrder,
        subtotal,
        delivery_charge: deliveryCharge,
        total_amount: totalAmount,
        advance_amount: paymentBreakdown.advanceAmount,
        remaining_amount: paymentBreakdown.remainingAmount,
        payment_status: initialPaymentStatus,
        payment_method: orderPaymentMethod,
        items: savedItems.map((si, idx) => ({
          product_name: si.product_name || resolvedItems[idx]?.productName,
          quantity: Number(si.quantity ?? resolvedItems[idx]?.quantity ?? 1),
          unit_price: Number(si.unit_price ?? resolvedItems[idx]?.unitPrice ?? 0),
          total_price: Number(si.total_price ?? resolvedItems[idx]?.totalPrice ?? 0),
          product_image: si.product_image || resolvedItems[idx]?.productImage || null,
          variation: si.variant_info || resolvedItems[idx]?.variantInfo || null,
        })),
      },
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
