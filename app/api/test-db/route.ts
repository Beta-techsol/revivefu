import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    // Test database connection
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: "DATABASE_URL environment variable is not set",
        timestamp: new Date().toISOString(),
      })
    }

    const sql = neon(process.env.DATABASE_URL)

    // Test basic connection
    const connectionTest = await sql`SELECT 1 as test, NOW() as current_time`

    // Test tables exist
    const tablesQuery = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    // Test sample data
    const productsCount = await sql`SELECT COUNT(*) as count FROM products`
    const ordersCount = await sql`SELECT COUNT(*) as count FROM orders`
    const categoriesCount = await sql`SELECT COUNT(*) as count FROM categories`
    const customersCount = await sql`SELECT COUNT(*) as count FROM customers`

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      connection: {
        test: connectionTest[0].test,
        current_time: connectionTest[0].current_time,
      },
      tables: tablesQuery.map((t) => t.table_name),
      data_counts: {
        products: Number.parseInt(productsCount[0].count),
        orders: Number.parseInt(ordersCount[0].count),
        categories: Number.parseInt(categoriesCount[0].count),
        customers: Number.parseInt(customersCount[0].count),
      },
      database_url_configured: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown database error",
        database_url_configured: !!process.env.DATABASE_URL,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
