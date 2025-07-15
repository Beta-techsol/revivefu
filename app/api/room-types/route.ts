import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const roomTypes = await sql`
      SELECT 
        id,
        name,
        slug,
        is_active,
        created_at,
        updated_at
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

export async function POST(request: Request) {
  try {
    const { name, slug, is_active = true } = await request.json()

    if (!name || !slug) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and slug are required",
        },
        { status: 400 },
      )
    }

    const result = await sql`
      INSERT INTO room_type (name, slug, is_active)
      VALUES (${name}, ${slug}, ${is_active})
      RETURNING id, name, slug, is_active, created_at, updated_at
    `

    return NextResponse.json({
      success: true,
      data: result[0],
    })
  } catch (error) {
    console.error("Error creating room type:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create room type",
      },
      { status: 500 },
    )
  }
}
