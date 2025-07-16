import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    // Environment check
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
    const statusFilter = searchParams.get("status") || "all"
    const paymentFilter = searchParams.get("payment") || "all"

    console.log("Transactions API - Filters:", { search, statusFilter, paymentFilter })

    // Test database connection first
    try {
      await sql`SELECT 1 as test`
    } catch (dbError) {
      console.error("Database connection failed:", dbError)
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          details: dbError instanceof Error ? dbError.message : "Unknown DB error",
        },
        { status: 500 },
      )
    }

    // Build the query step by step
    let baseQuery = `
      SELECT 
        id,
        order_number,
        COALESCE(customer_name, 'Unknown') as customer_name,
        COALESCE(customer_email, 'N/A') as customer_email,
        COALESCE(CAST(total_amount AS DECIMAL), 0) as total_amount,
        COALESCE(CAST(delivery_charge AS DECIMAL), 0) as delivery_charge,
        COALESCE(CAST(subtotal AS DECIMAL), 0) as subtotal,
        COALESCE(payment_method, 'cash_on_delivery') as payment_method,
        COALESCE(payment_status, 'unpaid') as payment_status,
        status as order_status,
        created_at,
        updated_at
      FROM orders 
      WHERE 1=1
    `

    // Add search filter if provided
    if (search.trim()) {
      const searchTerm = search.trim().replace(/'/g, "''") // Escape single quotes
      baseQuery += ` AND (
        order_number ILIKE '%${searchTerm}%' OR 
        COALESCE(customer_name, '') ILIKE '%${searchTerm}%' OR 
        COALESCE(customer_email, '') ILIKE '%${searchTerm}%'
      )`
    }

    // Add status filter if provided
    if (statusFilter && statusFilter !== "all") {
      if (statusFilter === "paid") {
        baseQuery += ` AND payment_status = 'paid'`
      } else if (statusFilter === "unpaid") {
        baseQuery += ` AND (payment_status = 'unpaid' OR payment_status IS NULL)`
      } else if (statusFilter === "pending") {
        baseQuery += ` AND payment_status = 'pending'`
      }
    }

    // Add payment method filter if provided
    if (paymentFilter && paymentFilter !== "all") {
      baseQuery += ` AND COALESCE(payment_method, '') ILIKE '%${paymentFilter.replace(/'/g, "''")}%'`
    }

    baseQuery += ` ORDER BY created_at DESC LIMIT 500`

    console.log("Executing transactions query...")
    const transactions = await sql(baseQuery)
    console.log(`Found ${transactions.length} transactions`)

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

    console.log(`Returning ${formattedTransactions.length} transactions`)

    return NextResponse.json({
      success: true,
      data: {
        transactions: formattedTransactions,
        total: formattedTransactions.length,
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

export async function PUT(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "Database configuration missing",
        },
        { status: 500 },
      )
    }

    const sql = neon(process.env.DATABASE_URL)
    const body = await request.json()
    const { orderId, payment_method, payment_status } = body

    console.log("Updating payment info for order:", orderId, { payment_method, payment_status })

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
