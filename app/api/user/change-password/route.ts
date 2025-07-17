import { type NextRequest, NextResponse } from "next/server"
import { requireUserAuth, hashPassword, verifyPassword } from "@/lib/user-auth"
import { changePasswordSchema } from "@/lib/validations/auth"
import { sql } from "@/lib/db"

export const POST = requireUserAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user
    const body = await request.json()

    // Validate input
    const validatedData = changePasswordSchema.parse(body)

    // Get current password hash
    const [userData] = await sql`
      SELECT password_hash FROM users WHERE id = ${user.id}
    `

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(validatedData.currentPassword, userData.password_hash)

    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    // Hash new password
    const newPasswordHash = await hashPassword(validatedData.newPassword)

    // Update password
    await sql`
      UPDATE users 
      SET password_hash = ${newPasswordHash}
      WHERE id = ${user.id}
    `

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error: any) {
    console.error("Change password error:", error)

    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to change password" }, { status: 500 })
  }
})
