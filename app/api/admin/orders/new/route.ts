import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// Middleware to verify admin authentication
async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    throw new Error("No authentication token")
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
  return decoded
}

// Generate order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `ORD-${timestamp}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin(request)

    const orderData = await request.json()

    // Validate required fields
    const requiredFields = ["customer_name", "customer_email", "total_amount", "status", "payment_status"]
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
          },
          { status: 400 },
        )
      }
    }

    // Generate order number if not provided
    const orderNumber = orderData.order_number || generateOrderNumber()

    // Insert new order
    const result = await sql`
      INSERT INTO orders (
        order_number, customer_name, customer_email, customer_phone,
        shipping_address, total_amount, status, payment_status, payment_method,
        notes, created_at, updated_at
      )
      VALUES (
        ${orderNumber}, 
        ${orderData.customer_name}, 
        ${orderData.customer_email}, 
        ${orderData.customer_phone || ""}, 
        ${orderData.shipping_address || ""}, 
        ${Number.parseFloat(orderData.total_amount)}, 
        ${orderData.status}, 
        ${orderData.payment_status}, 
        ${orderData.payment_method || "cash"}, 
        ${orderData.notes || ""}, 
        NOW(), 
        NOW()
      )
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order: result[0],
    })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create order",
      },
      { status: 500 },
    )
  }
}
