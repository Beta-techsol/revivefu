import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      JWT_SECRET: !!process.env.JWT_SECRET,
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      NEXT_PUBLIC_BASE_URL: !!process.env.NEXT_PUBLIC_BASE_URL,
    }

    // Check if users table exists and its structure
    let tableStructure = null
    let userCount = 0
    let sampleUsers = []

    try {
      const tableInfo = await sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        ORDER BY ordinal_position
      `
      tableStructure = tableInfo

      const countResult = await sql`SELECT COUNT(*) as count FROM users`
      userCount = countResult[0]?.count || 0

      const users = await sql`SELECT id, email, is_verified, created_at FROM users LIMIT 3`
      sampleUsers = users
    } catch (error) {
      console.error("Database check error:", error)
    }

    // Check if required packages are available
    const packagesCheck = {}
    try {
      require("bcryptjs")
      packagesCheck.bcryptjs = true
    } catch {
      packagesCheck.bcryptjs = false
    }

    try {
      require("jsonwebtoken")
      packagesCheck.jsonwebtoken = true
    } catch {
      packagesCheck.jsonwebtoken = false
    }

    return NextResponse.json({
      status: "Debug information",
      environment: envCheck,
      packages: packagesCheck,
      database: {
        tableExists: !!tableStructure,
        tableStructure,
        userCount,
        sampleUsers,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json(
      {
        error: "Debug check failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
