import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const result = await sql`
      SELECT COUNT(*) as count 
      FROM orders 
      WHERE is_viewed_by_admin = false
    `

    const count = Number.parseInt(result[0].count) || 0

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
        count: 0,
      },
      { status: 500 },
    )
  }
}
