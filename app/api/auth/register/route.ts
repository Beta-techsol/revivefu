import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/user-auth"
import { registerSchema } from "@/lib/validations/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = registerSchema.parse(body)

    // Create user
    const { user, emailVerificationToken } = await createUser(validatedData)

    // In a real app, you would send an email verification email here
    // For now, we'll just return success
    console.log(`Email verification token for ${user.email}: ${emailVerificationToken}`)

    return NextResponse.json({
      success: true,
      message: "Registration successful! Please check your email to verify your account.",
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    })
  } catch (error: any) {
    console.error("Registration error:", error)

    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 400 })
  }
}
