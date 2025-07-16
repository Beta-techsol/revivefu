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
    const status = searchParams.get("status")

    console.log("Fetching customers with filters:", { search, status })

    // Build the base query to get customer data from orders
    let customersQuery = `
      SELECT 
        customer_email as email,
        customer_name as name,
        customer_phone as phone,
        COUNT(*) as total_orders,
        SUM(CAST(total_amount AS DECIMAL)) as total_spent,
        SUM(CASE WHEN status IN ('pending', 'processing') THEN CAST(total_amount AS DECIMAL) ELSE 0 END) as pending_payments,
        MAX(created_at) as last_order_date,
        MIN(created_at) as join_date
      FROM orders 
      WHERE customer_email IS NOT NULL AND customer_email != ''
    `

    const params: any[] = []
    let paramIndex = 1

    if (search) {
      customersQuery += ` AND (
        customer_name ILIKE $${paramIndex} OR 
        customer_email ILIKE $${paramIndex + 1} OR 
        customer_phone ILIKE $${paramIndex + 2}
      )`
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm)
      paramIndex += 3
    }

    customersQuery += `
      GROUP BY customer_email, customer_name, customer_phone
      ORDER BY total_spent DESC
    `

    console.log("Executing query:", customersQuery)
    console.log("With params:", params)

    const customers = await sql(customersQuery, params)

    console.log("Raw customers data:", customers)

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

    console.log("Formatted customers:", filteredCustomers)

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
