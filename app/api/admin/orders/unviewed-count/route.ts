import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const result = await sql`
      SELECT COUNT(*) as count 
      FROM orders 
      WHERE status = 'pending'
    `

    const count = Number.parseInt(result[0].count) || 0

    return NextResponse.json({
      success: true,
      data: { count },
    })
  } catch (error) {
    console.error("Error fetching unviewed orders count:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch unviewed orders count",
        data: { count: 0 },
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    await sql`
      UPDATE orders 
      SET status = 'processing'
      WHERE status = 'pending'
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
      },
      { status: 500 },
    )
  }
}
