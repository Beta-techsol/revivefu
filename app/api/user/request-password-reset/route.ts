import { type NextRequest, NextResponse } from "next/server"
import { requestPasswordReset } from "@/lib/user-auth"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const success = await requestPasswordReset(email)

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: "If an account with this email exists, you will receive a password reset link.",
    })
  } catch (error) {
    console.error("Password reset request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
