import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const statusFilter = searchParams.get("status")
    const paymentFilter = searchParams.get("payment")

    console.log("Fetching transactions with filters:", { search, statusFilter, paymentFilter })

    // Build the base query to get transaction data from orders
    let transactionsQuery = `
      SELECT 
        id,
        order_number,
        customer_name,
        customer_email,
        total_amount,
        delivery_charge,
        subtotal,
        payment_method,
        payment_status,
        status as order_status,
        created_at,
        updated_at
      FROM orders 
      WHERE 1=1
    `

    const whereConditions = []

    if (search) {
      const searchTerm = search.replace(/'/g, "''") // Escape single quotes
      whereConditions.push(`(
        order_number ILIKE '%${searchTerm}%' OR 
        customer_name ILIKE '%${searchTerm}%' OR 
        customer_email ILIKE '%${searchTerm}%'
      )`)
    }

    if (statusFilter && statusFilter !== "all") {
      // Map payment status filter
      if (statusFilter === "paid") {
        whereConditions.push(`payment_status = 'paid'`)
      } else if (statusFilter === "unpaid") {
        whereConditions.push(`(payment_status = 'unpaid' OR payment_status IS NULL)`)
      } else if (statusFilter === "pending") {
        whereConditions.push(`payment_status = 'pending'`)
      }
    }

    if (paymentFilter && paymentFilter !== "all") {
      whereConditions.push(`payment_method ILIKE '%${paymentFilter}%'`)
    }

    if (whereConditions.length > 0) {
      transactionsQuery += ` AND ${whereConditions.join(" AND ")}`
    }

    transactionsQuery += ` ORDER BY created_at DESC`

    const transactions = await sql.unsafe(transactionsQuery)

    // Format the data
    const formattedTransactions = transactions.map((transaction: any) => ({
      id: `TXN-${transaction.id}`,
      orderId: transaction.order_number,
      customer: transaction.customer_name,
      customerEmail: transaction.customer_email,
      amount: Number.parseFloat(transaction.total_amount) || 0,
      fee: Number.parseFloat(transaction.delivery_charge) || 0,
      net: (Number.parseFloat(transaction.total_amount) || 0) - (Number.parseFloat(transaction.delivery_charge) || 0),
      method: transaction.payment_method || "Cash on Delivery",
      status: transaction.payment_status || "Unpaid",
      orderStatus: transaction.order_status,
      date: new Date(transaction.created_at).toLocaleString(),
      gateway: transaction.payment_method === "cash_on_delivery" ? "Cash" : "Bank Transfer",
      reference: `REF-${transaction.id}`,
      rawId: transaction.id,
    }))

    const response = NextResponse.json({
      success: true,
      data: {
        transactions: formattedTransactions,
        total: formattedTransactions.length,
      },
    })

    // Add cache control headers
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")

    return response
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch transactions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, payment_method, payment_status } = body

    console.log("Updating payment info for order:", orderId, { payment_method, payment_status })

    // Update the order with new payment information
    const updateResult = await sql`
      UPDATE orders 
      SET 
        payment_method = ${payment_method},
        payment_status = ${payment_status},
        updated_at = NOW()
      WHERE id = ${orderId}
      RETURNING *
    `

    if (updateResult.length === 0) {
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
      data: updateResult[0],
      message: "Payment information updated successfully",
    })
  } catch (error) {
    console.error("Error updating payment info:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update payment information",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
