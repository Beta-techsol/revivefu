import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL is not configured")
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"

    console.log("Fetching customers with filters:", { search, status })

    // Simple query without complex parameterization
    let query = `
      SELECT 
        customer_email as email,
        customer_name as name,
        customer_phone as phone,
        COUNT(*) as total_orders,
        SUM(CAST(COALESCE(total_amount, '0') AS DECIMAL)) as total_spent,
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
      const searchTerm = search.trim().toLowerCase()
      query += ` AND (
        LOWER(customer_name) LIKE '%${searchTerm}%' OR 
        LOWER(customer_email) LIKE '%${searchTerm}%' OR 
        LOWER(COALESCE(customer_phone, '')) LIKE '%${searchTerm}%'
      )`
    }

    query += `
      GROUP BY customer_email, customer_name, customer_phone
      HAVING COUNT(*) > 0
      ORDER BY total_spent DESC
      LIMIT 1000
    `

    console.log("Executing query:", query)

    const customers = await sql(query)
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
        pendingPayments: 0, // Calculate separately if needed
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
    console.error("Error fetching customers:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch customers",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
