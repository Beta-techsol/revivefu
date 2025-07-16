import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
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
        SUM(total_amount) as total_spent,
        SUM(CASE WHEN status IN ('pending', 'processing') THEN total_amount ELSE 0 END) as pending_payments,
        MAX(created_at) as last_order_date,
        MIN(created_at) as join_date,
        CASE 
          WHEN COUNT(*) >= 10 THEN 'VIP'
          WHEN COUNT(*) >= 5 THEN 'Active'
          WHEN COUNT(*) >= 1 THEN 'New'
          ELSE 'Inactive'
        END as status
      FROM orders 
      WHERE customer_email IS NOT NULL AND customer_email != ''
    `

    const whereConditions = []

    if (search) {
      const searchTerm = search.replace(/'/g, "''") // Escape single quotes
      whereConditions.push(`(
        customer_name ILIKE '%${searchTerm}%' OR 
        customer_email ILIKE '%${searchTerm}%' OR 
        customer_phone ILIKE '%${searchTerm}%'
      )`)
    }

    if (whereConditions.length > 0) {
      customersQuery += ` AND ${whereConditions.join(" AND ")}`
    }

    customersQuery += `
      GROUP BY customer_email, customer_name, customer_phone
      ORDER BY total_spent DESC
    `

    const customers = await sql.unsafe(customersQuery)

    // Filter by status if provided
    let filteredCustomers = customers
    if (status && status !== "all") {
      filteredCustomers = customers.filter((customer: any) => customer.status.toLowerCase() === status.toLowerCase())
    }

    // Format the data
    const formattedCustomers = filteredCustomers.map((customer: any) => ({
      id: customer.email, // Use email as unique ID
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      orders: Number.parseInt(customer.total_orders) || 0,
      totalSpent: Number.parseFloat(customer.total_spent) || 0,
      pendingPayments: Number.parseFloat(customer.pending_payments) || 0,
      status: customer.status,
      joinDate: customer.join_date ? new Date(customer.join_date).toISOString().split("T")[0] : "",
      lastOrder: customer.last_order_date ? new Date(customer.last_order_date).toISOString().split("T")[0] : "Never",
    }))

    const response = NextResponse.json({
      success: true,
      data: {
        customers: formattedCustomers,
        total: formattedCustomers.length,
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
