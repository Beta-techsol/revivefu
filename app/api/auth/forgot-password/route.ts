import { type NextRequest, NextResponse } from "next/server"
import { setPasswordResetToken } from "@/lib/user-auth"
import { sendPasswordResetEmail } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Set reset token (returns null if user doesn't exist or isn't verified)
    const resetToken = await setPasswordResetToken(email)

    // Always return success to prevent email enumeration
    if (resetToken) {
      const emailSent = await sendPasswordResetEmail(email, resetToken)
      if (!emailSent) {
        console.error("Failed to send password reset email to:", email)
      }
    }

    return NextResponse.json({
      message: "If an account with that email exists, a password reset link has been sent.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
