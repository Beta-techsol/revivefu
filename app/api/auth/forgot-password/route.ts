import { type NextRequest, NextResponse } from "next/server"
import { setPasswordResetToken } from "@/lib/user-auth"
import { sendPasswordResetEmail } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const resetToken = await setPasswordResetToken(email)

    if (resetToken) {
      const emailSent = await sendPasswordResetEmail(email, resetToken)
      if (!emailSent) {
        console.error("Failed to send password reset email to:", email)
      }
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      message: "If an account with that email exists, a password reset link has been sent.",
    })
  } catch (error) {
    console.error("Password reset request error:", error)
    return NextResponse.json({ error: "Password reset request failed" }, { status: 500 })
  }
}
