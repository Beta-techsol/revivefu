import { type NextRequest, NextResponse } from "next/server"
import { requireUserAuth } from "@/lib/user-auth"
import { updateProfileSchema } from "@/lib/validations/auth"
import { sql } from "@/lib/db"

export const GET = requireUserAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user

    const [userData] = await sql`
      SELECT id, email, first_name, last_name, phone, profile_picture_url, email_verified
      FROM users 
      WHERE id = ${user.id}
    `

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json({ error: "Failed to get profile" }, { status: 500 })
  }
})

export const PUT = requireUserAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user
    const body = await request.json()

    // Validate input
    const validatedData = updateProfileSchema.parse(body)

    // Update user profile
    const [updatedUser] = await sql`
      UPDATE users 
      SET first_name = ${validatedData.first_name}, 
          last_name = ${validatedData.last_name}
      WHERE id = ${user.id}
      RETURNING id, email, first_name, last_name, phone, profile_picture_url
    `

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    })
  } catch (error: any) {
    console.error("Update profile error:", error)

    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
})
