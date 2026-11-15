import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { initializeDatabase } from "@/scripts/init-db"

export async function GET() {
  try {
    const result = await initializeDatabase()
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Database initialization error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.stack,
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  return GET()
}
