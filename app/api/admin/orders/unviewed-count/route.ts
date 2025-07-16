import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Get count of unviewed orders (status = 'pending')
    const countResult = await sql`
      SELECT COUNT(*) as count 
      FROM orders 
      WHERE status = 'pending'
    `

    const count = Number.parseInt(countResult[0].count)

    return NextResponse.json({
      success: true,
      data: {
        count,
      },
    })
  } catch (error) {
    console.error("Error fetching unviewed orders count:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch unviewed orders count",
        data: {
          count: 0,
        },
      },
      { status: 500 },
    )
  }
}
