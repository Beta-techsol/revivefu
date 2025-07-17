import { type NextRequest, NextResponse } from "next/server"
import { requireUserAuth, verifyPassword, hashPassword } from "@/lib/user-auth"
import { sql } from "@/lib/db"

export const POST = requireUserAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 })
    }

    // Get current password hash
    const [userRecord] = await sql`
      SELECT password_hash FROM users WHERE id = ${user.id}
    `

    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, userRecord.password_hash)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    // Hash new password and update
    const newPasswordHash = await hashPassword(newPassword)

    await sql`
      UPDATE users 
      SET password_hash = ${newPasswordHash}
      WHERE id = ${user.id}
    `

    return NextResponse.json({ success: true, message: "Password changed successfully" })
  } catch (error) {
    console.error("Change password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
