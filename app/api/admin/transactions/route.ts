import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get("status")
    const paymentFilter = searchParams.get("payment")
    const search = searchParams.get("search")

    console.log("Fetching transactions with filters:", { statusFilter, paymentFilter, search })

    // Build the base query conditions
    const whereConditions = []

    if (statusFilter && statusFilter !== "all") {
      // Map status filter to payment status logic
      if (statusFilter === "completed") {
        whereConditions.push(`status IN ('delivered', 'completed')`)
      } else if (statusFilter === "pending") {
        whereConditions.push(`status IN ('pending', 'processing')`)
      } else if (statusFilter === "failed") {
        whereConditions.push(`status = 'cancelled'`)
      } else if (statusFilter === "refunded") {
        whereConditions.push(`status = 'refunded'`)
      }
    }

    if (paymentFilter && paymentFilter !== "all") {
      whereConditions.push(`payment_method ILIKE '%${paymentFilter}%'`)
    }

    if (search) {
      const searchTerm = search.replace(/'/g, "''") // Escape single quotes
      whereConditions.push(`(
        order_number ILIKE '%${searchTerm}%' OR 
        customer_name ILIKE '%${searchTerm}%' OR 
        customer_email ILIKE '%${searchTerm}%'
      )`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    // Get transactions (orders) data
    let transactionsQuery = `
      SELECT 
        id,
        order_number,
        customer_name,
        customer_email,
        total_amount,
        payment_method,
        status,
        created_at,
        updated_at
      FROM orders 
    `

    if (whereClause) {
      transactionsQuery += ` ${whereClause}`
    }

    transactionsQuery += ` ORDER BY created_at DESC`

    const transactions = await sql.unsafe(transactionsQuery)

    // Calculate processing fees (assumed 3% fee)
    const formattedTransactions = transactions.map((transaction) => {
      const amount = Number.parseFloat(transaction.total_amount) || 0
      const fee = amount * 0.03 // 3% processing fee
      const net = amount - fee

      // Map order status to payment status
      let paymentStatus = "Pending"
      if (transaction.status === "delivered" || transaction.status === "completed") {
        paymentStatus = "Completed"
      } else if (transaction.status === "cancelled") {
        paymentStatus = "Failed"
      } else if (transaction.status === "refunded") {
        paymentStatus = "Refunded"
      }

      return {
        id: `TXN-${transaction.id}`,
        orderId: transaction.order_number,
        customer: transaction.customer_name,
        customerEmail: transaction.customer_email,
        amount: amount,
        fee: fee,
        net: net,
        method:
          transaction.payment_method === "cash_on_delivery"
            ? "Cash on Delivery"
            : transaction.payment_method === "bank_transfer"
              ? "Bank Transfer"
              : transaction.payment_method === "card"
                ? "Credit Card"
                : "Cash on Delivery",
        status: paymentStatus,
        date: new Date(transaction.created_at).toLocaleString(),
        gateway:
          transaction.payment_method === "cash_on_delivery"
            ? "Cash"
            : transaction.payment_method === "bank_transfer"
              ? "Bank"
              : "Stripe",
        reference: `${transaction.payment_method.toUpperCase()}-${transaction.id}`,
        originalOrderId: transaction.id,
        originalStatus: transaction.status,
      }
    })

    // Set cache headers to prevent caching
    const response = NextResponse.json({
      success: true,
      data: formattedTransactions,
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
