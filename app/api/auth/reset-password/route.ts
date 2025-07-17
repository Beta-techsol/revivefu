import { type NextRequest, NextResponse } from "next/server"
import { resetPassword } from "@/lib/user-auth"
import { resetPasswordSchema } from "@/lib/validations/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = resetPasswordSchema.parse(body)

    // Reset password
    const success = await resetPassword(validatedData.token, validatedData.password)

    if (!success) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Password reset successful! You can now log in with your new password.",
    })
  } catch (error: any) {
    console.error("Reset password error:", error)

    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Password reset failed" }, { status: 500 })
  }
}
