import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Count orders that are pending or new (unviewed)
    const result = await sql`
      SELECT COUNT(*) as count
      FROM orders 
      WHERE status IN ('pending', 'new')
    `

    const count = Number.parseInt(result[0]?.count || "0")

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
