import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const roomTypes = await sql`
      SELECT id, name, slug, is_active
      FROM room_type 
      WHERE is_active = true
      ORDER BY name ASC
    `

    return NextResponse.json({
      success: true,
      data: roomTypes,
    })
  } catch (error) {
    console.error("Error fetching room types:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch room types",
      },
      { status: 500 },
    )
  }
}
