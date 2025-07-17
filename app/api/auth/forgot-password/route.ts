import { type NextRequest, NextResponse } from "next/server"
import { generatePasswordResetToken } from "@/lib/user-auth"
import { forgotPasswordSchema } from "@/lib/validations/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = forgotPasswordSchema.parse(body)

    // Generate reset token
    const resetToken = await generatePasswordResetToken(validatedData.email)

    if (resetToken) {
      // In a real app, you would send an email with the reset link here
      console.log(`Password reset token for ${validatedData.email}: ${resetToken}`)
      console.log(`Reset link: ${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`)
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, we've sent a password reset link.",
    })
  } catch (error: any) {
    console.error("Forgot password error:", error)

    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Request failed" }, { status: 500 })
  }
}
