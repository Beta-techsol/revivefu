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
    const status = searchParams.get("status") || "all"

    console.log("Customers API - Filters:", { search, status })

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
        customer_email as email,
        customer_name as name,
        COALESCE(customer_phone, 'N/A') as phone,
        COUNT(*) as total_orders,
        COALESCE(SUM(CAST(total_amount AS DECIMAL)), 0) as total_spent,
        MAX(created_at) as last_order_date,
        MIN(created_at) as join_date
      FROM orders 
      WHERE customer_email IS NOT NULL 
        AND customer_email != '' 
        AND customer_name IS NOT NULL
        AND customer_name != ''
    `

    // Add search filter if provided
    if (search.trim()) {
      const searchTerm = search.trim().replace(/'/g, "''") // Escape single quotes
      baseQuery += ` AND (
        customer_name ILIKE '%${searchTerm}%' OR 
        customer_email ILIKE '%${searchTerm}%' OR 
        COALESCE(customer_phone, '') ILIKE '%${searchTerm}%'
      )`
    }

    baseQuery += `
      GROUP BY customer_email, customer_name, customer_phone
      HAVING COUNT(*) > 0
      ORDER BY total_spent DESC
      LIMIT 500
    `

    console.log("Executing customers query...")
    const customers = await sql(baseQuery)
    console.log(`Found ${customers.length} customers`)

    // Format the data
    const formattedCustomers = customers.map((customer: any) => {
      const totalOrders = Number.parseInt(customer.total_orders) || 0
      const totalSpent = Number.parseFloat(customer.total_spent) || 0

      // Determine status based on order count
      let customerStatus = "Inactive"
      if (totalOrders >= 10) {
        customerStatus = "VIP"
      } else if (totalOrders >= 5) {
        customerStatus = "Active"
      } else if (totalOrders >= 1) {
        customerStatus = "New"
      }

      return {
        id: customer.email,
        name: customer.name || "Unknown",
        email: customer.email,
        phone: customer.phone || "N/A",
        orders: totalOrders,
        totalSpent: totalSpent,
        pendingPayments: 0, // We'll calculate this separately if needed
        status: customerStatus,
        joinDate: customer.join_date ? new Date(customer.join_date).toISOString().split("T")[0] : "",
        lastOrder: customer.last_order_date ? new Date(customer.last_order_date).toISOString().split("T")[0] : "Never",
      }
    })

    // Filter by status if provided
    let filteredCustomers = formattedCustomers
    if (status && status !== "all") {
      filteredCustomers = formattedCustomers.filter(
        (customer: any) => customer.status.toLowerCase() === status.toLowerCase(),
      )
    }

    console.log(`Returning ${filteredCustomers.length} filtered customers`)

    return NextResponse.json({
      success: true,
      data: {
        customers: filteredCustomers,
        total: filteredCustomers.length,
      },
    })
  } catch (error) {
    console.error("Customers API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch customers",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : null,
      },
      { status: 500 },
    )
  }
}
