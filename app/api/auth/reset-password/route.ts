import { type NextRequest, NextResponse } from "next/server"
import { resetPasswordWithToken } from "@/lib/user-auth"

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        {
          error: "Token and password are required",
        },
        { status: 400 },
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          error: "Password must be at least 6 characters long",
        },
        { status: 400 },
      )
    }

    const isReset = await resetPasswordWithToken(token, password)

    if (!isReset) {
      return NextResponse.json(
        {
          error: "Invalid or expired reset token",
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      message: "Password reset successfully. You can now log in with your new password.",
    })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ error: "Password reset failed" }, { status: 500 })
  }
}
