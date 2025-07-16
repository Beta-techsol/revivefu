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

    console.log("Fetching customers with filters:", { search, statusFilter })

    // Build the base query to aggregate customer data from orders
    const whereConditions = []

    if (search) {
      const searchTerm = search.replace(/'/g, "''") // Escape single quotes
      whereConditions.push(`(
        customer_name ILIKE '%${searchTerm}%' OR 
        customer_email ILIKE '%${searchTerm}%' OR 
        customer_phone ILIKE '%${searchTerm}%'
      )`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    // Get aggregated customer data
    let customersQuery = `
      SELECT 
        customer_email as email,
        customer_name as name,
        customer_phone as phone,
        COUNT(*) as total_orders,
        SUM(total_amount) as total_spent,
        SUM(CASE WHEN status IN ('pending', 'processing') THEN total_amount ELSE 0 END) as pending_amount,
        MIN(created_at) as first_order_date,
        MAX(created_at) as last_order_date,
        CASE 
          WHEN COUNT(*) >= 10 THEN 'VIP'
          WHEN COUNT(*) >= 5 THEN 'Active'
          WHEN MAX(created_at) >= NOW() - INTERVAL '30 days' THEN 'Active'
          WHEN COUNT(*) = 0 THEN 'Inactive'
          ELSE 'New'
        END as status
      FROM orders 
    `

    if (whereClause) {
      customersQuery += ` ${whereClause}`
    }

    customersQuery += ` 
      GROUP BY customer_email, customer_name, customer_phone
      ORDER BY total_spent DESC
    `

    const customers = await sql.unsafe(customersQuery)

    // Filter by status if specified
    let filteredCustomers = customers
    if (statusFilter && statusFilter !== "all") {
      filteredCustomers = customers.filter((customer) => customer.status.toLowerCase() === statusFilter.toLowerCase())
    }

    // Format the data
    const formattedCustomers = filteredCustomers.map((customer) => ({
      id: customer.email, // Use email as ID
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      orders: Number.parseInt(customer.total_orders) || 0,
      totalSpent: Number.parseFloat(customer.total_spent) || 0,
      pendingAmount: Number.parseFloat(customer.pending_amount) || 0,
      status: customer.status,
      joinDate: customer.first_order_date ? new Date(customer.first_order_date).toISOString().split("T")[0] : "",
      lastOrder: customer.last_order_date ? new Date(customer.last_order_date).toISOString().split("T")[0] : "Never",
    }))

    // Set cache headers to prevent caching
    const response = NextResponse.json({
      success: true,
      data: formattedCustomers,
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
