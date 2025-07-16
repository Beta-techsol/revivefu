import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const result = await sql`
      SELECT COUNT(*) as count 
      FROM orders 
      WHERE status = 'pending' OR status = 'processing'
    `

    const count = Number.parseInt(result[0].count)

    return NextResponse.json({
      success: true,
      count,
    })
  } catch (error) {
    console.error("Error fetching unviewed orders count:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch unviewed orders count",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
