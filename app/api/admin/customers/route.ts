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
    const status = searchParams.get("status")

    console.log("Fetching customers with filters:", { search, status })

    // Build the base query to get customer data from orders
    const whereConditions = []
    const queryParams = []

    // Base conditions
    whereConditions.push("customer_email IS NOT NULL")
    whereConditions.push("customer_email != ''")
    whereConditions.push("customer_name IS NOT NULL")

    // Add search filter if provided
    if (search && search.trim()) {
      whereConditions.push(`(
        customer_name ILIKE $${queryParams.length + 1} OR 
        customer_email ILIKE $${queryParams.length + 2} OR 
        customer_phone ILIKE $${queryParams.length + 3}
      )`)
      const searchTerm = `%${search.trim()}%`
      queryParams.push(searchTerm, searchTerm, searchTerm)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    const customersQuery = `
      SELECT 
        customer_email as email,
        customer_name as name,
        customer_phone as phone,
        COUNT(*) as total_orders,
        SUM(COALESCE(CAST(total_amount AS DECIMAL), 0)) as total_spent,
        SUM(CASE 
          WHEN status IN ('pending', 'processing') 
          THEN COALESCE(CAST(total_amount AS DECIMAL), 0) 
          ELSE 0 
        END) as pending_payments,
        MAX(created_at) as last_order_date,
        MIN(created_at) as join_date
      FROM orders 
      ${whereClause}
      GROUP BY customer_email, customer_name, customer_phone
      HAVING COUNT(*) > 0
      ORDER BY total_spent DESC
    `

    console.log("Executing customers query:", customersQuery)
    console.log("With params:", queryParams)

    const customers = await sql(customersQuery, queryParams)

    console.log("Raw customers data:", customers.length, "records")

    // Format the data and apply status logic
    const formattedCustomers = customers.map((customer: any) => {
      const totalOrders = Number.parseInt(customer.total_orders) || 0
      const totalSpent = Number.parseFloat(customer.total_spent) || 0
      const pendingPayments = Number.parseFloat(customer.pending_payments) || 0

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
        id: customer.email, // Use email as unique ID
        name: customer.name || "Unknown",
        email: customer.email,
        phone: customer.phone || "N/A",
        orders: totalOrders,
        totalSpent: totalSpent,
        pendingPayments: pendingPayments,
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

    console.log("Formatted customers:", filteredCustomers.length, "records")

    const response = NextResponse.json({
      success: true,
      data: {
        customers: filteredCustomers,
        total: filteredCustomers.length,
      },
    })

    // Add cache control headers
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")

    return response
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
