import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    environment: {},
    database: {},
    query: {},
    error: null,
  }

  try {
    // Check environment variables
    debugInfo.environment = {
      DATABASE_URL_exists: !!process.env.DATABASE_URL,
      DATABASE_URL_length: process.env.DATABASE_URL?.length || 0,
      NODE_ENV: process.env.NODE_ENV,
    }

    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set")
    }

    const sql = neon(process.env.DATABASE_URL)

    // Test basic connection
    debugInfo.database.connection_test = "attempting..."
    const connectionTest = await sql`SELECT NOW() as current_time, version() as db_version`
    debugInfo.database.connection_test = "success"
    debugInfo.database.current_time = connectionTest[0]?.current_time
    debugInfo.database.version = connectionTest[0]?.db_version

    // Check if orders table exists
    debugInfo.database.orders_table_check = "checking..."
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'orders'
      ) as table_exists
    `
    debugInfo.database.orders_table_exists = tableCheck[0]?.table_exists

    if (!tableCheck[0]?.table_exists) {
      throw new Error("Orders table does not exist")
    }

    // Check table structure
    debugInfo.database.table_structure = "checking..."
    const columns = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'orders'
      ORDER BY ordinal_position
    `
    debugInfo.database.columns = columns

    // Check if we have any data
    debugInfo.query.data_check = "checking..."
    const dataCount = await sql`SELECT COUNT(*) as total FROM orders`
    debugInfo.query.total_orders = dataCount[0]?.total

    // Try a simple customer query
    debugInfo.query.customer_query = "attempting..."
    const simpleQuery = await sql`
      SELECT 
        customer_email,
        customer_name,
        COUNT(*) as order_count
      FROM orders 
      WHERE customer_email IS NOT NULL 
        AND customer_email != ''
      GROUP BY customer_email, customer_name
      LIMIT 5
    `
    debugInfo.query.sample_customers = simpleQuery
    debugInfo.query.customer_query = "success"

    return NextResponse.json({
      success: true,
      debug: debugInfo,
      message: "Debug information collected successfully",
    })
  } catch (error) {
    debugInfo.error = {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : null,
      name: error instanceof Error ? error.name : "UnknownError",
    }

    console.error("Debug API Error:", error)

    return NextResponse.json(
      {
        success: false,
        debug: debugInfo,
        error: debugInfo.error,
      },
      { status: 500 },
    )
  }
}
