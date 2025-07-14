import { type NextRequest, NextResponse } from "next/server"
import { initializeDatabase } from "@/scripts/init-db"

export async function GET(request: NextRequest) {
  try {
    console.log("🚀 Database initialization API called")

    // Check if we have required environment variables
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_URL environment variable is not set",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        {
          success: false,
          error: "ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    const result = await initializeDatabase()

    if (result.success) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 500 })
    }
  } catch (error) {
    console.error("❌ API initialization error:", error)
    return NextResponse.json(
      {
        success: false,
        error: `API initialization failed: ${error.message}`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
