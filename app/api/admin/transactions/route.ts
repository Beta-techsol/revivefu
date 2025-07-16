import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL is not configured")
      return NextResponse.json(
        {
          success: false,
          error: "Database configuration missing",
        },
        { status: 500 },
      )
    }

    const sql = neon(process.env.DATABASE_URL)
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"
    const paymentStatus = searchParams.get("payment_status") || "all"

    console.log("Transactions API - Filters:", { search, status, paymentStatus })

    // Build base query
    let transactions
    if (search.trim()) {
      const searchTerm = `%${search.trim()}%`
      transactions = await sql`
        SELECT 
          id,
          order_number,
          customer_name,
          customer_email,
          customer_phone,
          total_amount,
          status,
          payment_method,
          COALESCE(payment_status, 'unpaid') as payment_status,
          created_at,
          updated_at
        FROM orders 
        WHERE (
          order_number ILIKE ${searchTerm} OR 
          customer_name ILIKE ${searchTerm} OR 
          customer_email ILIKE ${searchTerm} OR 
          customer_phone ILIKE ${searchTerm}
        )
        ORDER BY created_at DESC
        LIMIT 1000
      `
    } else {
      transactions = await sql`
        SELECT 
          id,
          order_number,
          customer_name,
          customer_email,
          customer_phone,
          total_amount,
          status,
          payment_method,
          COALESCE(payment_status, 'unpaid') as payment_status,
          created_at,
          updated_at
        FROM orders 
        ORDER BY created_at DESC
        LIMIT 1000
      `
    }

    console.log(`Found ${transactions.length} transactions`)

    // Format the data
    const formattedTransactions = transactions.map((transaction: any) => {
      return {
        id: transaction.id,
        orderNumber: transaction.order_number,
        customerName: transaction.customer_name,
        customerEmail: transaction.customer_email,
        customerPhone: transaction.customer_phone,
        amount: Number.parseFloat(transaction.total_amount) || 0,
        status: transaction.status,
        paymentMethod: transaction.payment_method,
        paymentStatus: transaction.payment_status || "unpaid",
        date: transaction.created_at ? new Date(transaction.created_at).toISOString().split("T")[0] : "",
        time: transaction.created_at ? new Date(transaction.created_at).toLocaleTimeString() : "",
        updatedAt: transaction.updated_at,
      }
    })

    // Apply filters
    let filteredTransactions = formattedTransactions

    if (status && status !== "all") {
      filteredTransactions = filteredTransactions.filter(
        (transaction: any) => transaction.status.toLowerCase() === status.toLowerCase(),
      )
    }

    if (paymentStatus && paymentStatus !== "all") {
      filteredTransactions = filteredTransactions.filter(
        (transaction: any) => transaction.paymentStatus.toLowerCase() === paymentStatus.toLowerCase(),
      )
    }

    console.log(`Returning ${filteredTransactions.length} filtered transactions`)

    // Calculate summary stats
    const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0)
    const paidAmount = filteredTransactions
      .filter((t) => t.paymentStatus === "paid")
      .reduce((sum, t) => sum + t.amount, 0)
    const pendingAmount = filteredTransactions
      .filter((t) => t.paymentStatus === "pending")
      .reduce((sum, t) => sum + t.amount, 0)

    return NextResponse.json({
      success: true,
      data: {
        transactions: filteredTransactions,
        total: filteredTransactions.length,
        summary: {
          totalAmount,
          paidAmount,
          pendingAmount,
          unpaidAmount: totalAmount - paidAmount - pendingAmount,
        },
      },
    })
  } catch (error) {
    console.error("Transactions API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch transactions",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : null,
      },
      { status: 500 },
    )
  }
}
