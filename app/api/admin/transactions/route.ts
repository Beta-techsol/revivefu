import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured")
    }

    const sql = neon(process.env.DATABASE_URL)
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const statusFilter = searchParams.get("status")
    const paymentFilter = searchParams.get("payment")

    console.log("Fetching transactions with filters:", { search, statusFilter, paymentFilter })

    // Build the base query to get transaction data from orders
    const whereConditions = ["1=1"]
    const queryParams = []

    // Add search filter if provided
    if (search && search.trim()) {
      whereConditions.push(`(
        order_number ILIKE $${queryParams.length + 1} OR 
        customer_name ILIKE $${queryParams.length + 2} OR 
        customer_email ILIKE $${queryParams.length + 3}
      )`)
      const searchTerm = `%${search.trim()}%`
      queryParams.push(searchTerm, searchTerm, searchTerm)
    }

    // Add status filter if provided
    if (statusFilter && statusFilter !== "all") {
      if (statusFilter === "paid") {
        whereConditions.push(`payment_status = $${queryParams.length + 1}`)
        queryParams.push("paid")
      } else if (statusFilter === "unpaid") {
        whereConditions.push(`(payment_status = $${queryParams.length + 1} OR payment_status IS NULL)`)
        queryParams.push("unpaid")
      } else if (statusFilter === "pending") {
        whereConditions.push(`payment_status = $${queryParams.length + 1}`)
        queryParams.push("pending")
      }
    }

    // Add payment method filter if provided
    if (paymentFilter && paymentFilter !== "all") {
      whereConditions.push(`payment_method ILIKE $${queryParams.length + 1}`)
      queryParams.push(`%${paymentFilter}%`)
    }

    const whereClause = whereConditions.join(" AND ")

    const transactionsQuery = `
      SELECT 
        id,
        order_number,
        customer_name,
        customer_email,
        COALESCE(CAST(total_amount AS DECIMAL), 0) as total_amount,
        COALESCE(CAST(delivery_charge AS DECIMAL), 0) as delivery_charge,
        COALESCE(CAST(subtotal AS DECIMAL), 0) as subtotal,
        COALESCE(payment_method, 'cash_on_delivery') as payment_method,
        COALESCE(payment_status, 'unpaid') as payment_status,
        status as order_status,
        created_at,
        updated_at
      FROM orders 
      WHERE ${whereClause}
      ORDER BY created_at DESC
    `

    console.log("Executing transactions query:", transactionsQuery)
    console.log("With params:", queryParams)

    const transactions = await sql(transactionsQuery, queryParams)

    console.log("Raw transactions data:", transactions.length, "records")

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

    console.log("Formatted transactions:", formattedTransactions.length, "records")

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
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured")
    }

    const sql = neon(process.env.DATABASE_URL)
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
