import { NextResponse } from "next/server"
import { sql, testConnection } from "@/lib/db"

export async function GET() {
  try {
    console.log("[v0] Starting comprehensive database debug...")

    // Check environment variables
    const databaseUrl = process.env.DATABASE_URL
    const postgresUrl = process.env.POSTGRES_URL
    const neonProjectId = process.env.NEON_PROJECT_ID

    console.log("[v0] Environment check:")
    console.log("- DATABASE_URL exists:", !!databaseUrl)
    console.log("- POSTGRES_URL exists:", !!postgresUrl)
    console.log("- NEON_PROJECT_ID exists:", !!neonProjectId)
    console.log("- DATABASE_URL length:", databaseUrl?.length || 0)

    if (!databaseUrl) {
      return NextResponse.json({
        success: false,
        error: "DATABASE_URL environment variable is missing",
        envVars: {
          DATABASE_URL: !!databaseUrl,
          POSTGRES_URL: !!postgresUrl,
          NEON_PROJECT_ID: !!neonProjectId,
        },
      })
    }

    // Test basic connection
    console.log("[v0] Testing basic connection...")
    const connectionTest = await testConnection()
    console.log("[v0] Connection test result:", connectionTest)

    if (!connectionTest) {
      return NextResponse.json(
        {
          success: false,
          error: "Basic connection test failed",
          connectionTest: false,
        },
        { status: 500 },
      )
    }

    // Test simple query
    console.log("[v0] Testing simple query...")
    const simpleResult = await sql`SELECT 1 as test, NOW() as current_time`
    console.log("[v0] Simple query result:", simpleResult)

    // Check if admin_users table exists
    console.log("[v0] Checking admin_users table...")
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admin_users'
      ) as table_exists
    `
    console.log("[v0] Admin users table exists:", tableCheck[0]?.table_exists)

    if (!tableCheck[0]?.table_exists) {
      return NextResponse.json({
        success: false,
        error: "admin_users table does not exist",
        tableExists: false,
      })
    }

    // Check admin users count
    console.log("[v0] Counting admin users...")
    const adminCount = await sql`SELECT COUNT(*) as count FROM admin_users`
    console.log("[v0] Admin users count:", adminCount[0]?.count)

    // Check specific admin user
    console.log("[v0] Looking for specific admin user...")
    const adminUser = await sql`
      SELECT id, email, name, role, is_active, created_at, last_login,
             CASE WHEN password_hash IS NOT NULL THEN 'has_password' ELSE 'no_password' END as password_status
      FROM admin_users 
      WHERE email = 'admin@revivefurniture.com'
    `
    console.log("[v0] Admin user data:", adminUser)

    return NextResponse.json({
      success: true,
      message: "Database connection and checks successful",
      data: {
        connectionTest: true,
        simpleQuery: simpleResult[0],
        tableExists: tableCheck[0]?.table_exists,
        adminUsersCount: Number.parseInt(adminCount[0]?.count || "0"),
        adminUserExists: adminUser.length > 0,
        adminUserData: adminUser[0] || null,
      },
      environment: {
        DATABASE_URL: !!databaseUrl,
        POSTGRES_URL: !!postgresUrl,
        NEON_PROJECT_ID: !!neonProjectId,
      },
    })
  } catch (error) {
    console.error("[v0] Database debug error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        errorType: error instanceof Error ? error.constructor.name : "Unknown",
        stack: error instanceof Error ? error.stack : undefined,
        environment: {
          DATABASE_URL: !!process.env.DATABASE_URL,
          POSTGRES_URL: !!process.env.POSTGRES_URL,
          NEON_PROJECT_ID: !!process.env.NEON_PROJECT_ID,
        },
      },
      { status: 500 },
    )
  }
}
