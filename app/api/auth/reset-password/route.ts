import { type NextRequest, NextResponse } from "next/server"
import { resetPassword } from "@/lib/user-auth"
import { z } from "zod"

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = resetPasswordSchema.parse(body)

    const success = await resetPassword(token, password)

    if (!success) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }

    return NextResponse.json({
      message: "Password reset successful",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }

    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}
