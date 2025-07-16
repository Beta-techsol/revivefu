import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
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
        CAST(total_amount AS DECIMAL) as total_amount,
        CAST(delivery_charge AS DECIMAL) as delivery_charge,
        CAST(subtotal AS DECIMAL) as subtotal,
        payment_method,
        payment_status,
        status as order_status,
        created_at,
        updated_at
      FROM orders 
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    if (search) {
      transactionsQuery += ` AND (
        order_number ILIKE $${paramIndex} OR 
        customer_name ILIKE $${paramIndex + 1} OR 
        customer_email ILIKE $${paramIndex + 2}
      )`
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm)
      paramIndex += 3
    }

    if (statusFilter && statusFilter !== "all") {
      if (statusFilter === "paid") {
        transactionsQuery += ` AND payment_status = $${paramIndex}`
        params.push("paid")
        paramIndex++
      } else if (statusFilter === "unpaid") {
        transactionsQuery += ` AND (payment_status = $${paramIndex} OR payment_status IS NULL)`
        params.push("unpaid")
        paramIndex++
      } else if (statusFilter === "pending") {
        transactionsQuery += ` AND payment_status = $${paramIndex}`
        params.push("pending")
        paramIndex++
      }
    }

    if (paymentFilter && paymentFilter !== "all") {
      transactionsQuery += ` AND payment_method ILIKE $${paramIndex}`
      params.push(`%${paymentFilter}%`)
      paramIndex++
    }

    transactionsQuery += ` ORDER BY created_at DESC`

    console.log("Executing query:", transactionsQuery)
    console.log("With params:", params)

    const transactions = await sql(transactionsQuery, params)

    console.log("Raw transactions data:", transactions)

    // Format the data
    const formattedTransactions = transactions.map((transaction: any) => {
      const amount = Number.parseFloat(transaction.total_amount) || 0
      const fee = Number.parseFloat(transaction.delivery_charge) || 0
      const net = amount - fee

      return {
        id: `TXN-${transaction.id}`,
        orderId: transaction.order_number,
        customer: transaction.customer_name || "Unknown",
        customerEmail: transaction.customer_email || "N/A",
        amount: amount,
        fee: fee,
        net: net,
        method: transaction.payment_method || "Cash on Delivery",
        status: transaction.payment_status || "Unpaid",
        orderStatus: transaction.order_status,
        date: new Date(transaction.created_at).toLocaleString(),
        gateway: transaction.payment_method === "cash_on_delivery" ? "Cash" : "Bank Transfer",
        reference: `REF-${transaction.id}`,
        rawId: transaction.id,
      }
    })

    console.log("Formatted transactions:", formattedTransactions)

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
    const sql = neon(process.env.DATABASE_URL!)
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
