import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    console.log("Fetching room types...")

    const roomTypes = await sql`
      SELECT id, name, slug, created_at, updated_at
      FROM room_type
      ORDER BY name ASC
    `

    console.log("Room types fetched:", roomTypes.length)

    return NextResponse.json({
      success: true,
      roomTypes: roomTypes,
    })
  } catch (error) {
    console.error("Error fetching room types:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch room types",
      },
      { status: 500 },
    )
  }
}
