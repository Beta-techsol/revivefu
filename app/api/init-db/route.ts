import { type NextRequest, NextResponse } from "next/server"
import { initializeDatabase } from "@/scripts/init-db"

export async function GET(request: NextRequest) {
  try {
    const result = await initializeDatabase()

    return NextResponse.json({
      success: true,
      message: result.message,
      adminEmail: result.adminEmail,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database initialization error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
