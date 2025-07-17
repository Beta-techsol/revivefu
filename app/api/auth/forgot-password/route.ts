import { type NextRequest, NextResponse } from "next/server"
import { generatePasswordResetToken } from "@/lib/user-auth"
import { z } from "zod"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)

    const token = await generatePasswordResetToken(email)

    if (token) {
      // In a real app, you would send an email here
      // For now, we'll just return success
      console.log(`Password reset token for ${email}: ${token}`)
      console.log(`Reset URL: ${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${token}`)
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      message: "If an account with that email exists, a password reset link has been sent.",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
