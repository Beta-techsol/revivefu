import { type NextRequest, NextResponse } from "next/server"
import { requireUserAuth } from "@/lib/user-auth"
import { sql } from "@/lib/db"

export const GET = requireUserAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user

    const [profile] = await sql`
      SELECT id, email, name, phone, profile_picture, email_verified, created_at
      FROM users 
      WHERE id = ${user.id}
    `

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const PUT = requireUserAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user
    const { name, phone, profile_picture } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const [updatedProfile] = await sql`
      UPDATE users 
      SET name = ${name}, phone = ${phone || null}, profile_picture = ${profile_picture || null}
      WHERE id = ${user.id}
      RETURNING id, email, name, phone, profile_picture, email_verified
    `

    if (!updatedProfile) {
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json({ success: true, profile: updatedProfile })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
