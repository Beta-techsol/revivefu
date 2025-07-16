import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const result = await sql`
      SELECT COUNT(*) as count 
      FROM orders 
      WHERE is_viewed_by_admin = FALSE
    `

    return NextResponse.json({
      success: true,
      data: { count: Number.parseInt(result[0].count) },
    })
  } catch (error) {
    console.error("Error fetching unviewed orders count:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch count",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    await sql`
      UPDATE orders 
      SET is_viewed_by_admin = TRUE 
      WHERE is_viewed_by_admin = FALSE
    `

    return NextResponse.json({
      success: true,
      message: "Orders marked as viewed",
    })
  } catch (error) {
    console.error("Error marking orders as viewed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to mark orders as viewed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
