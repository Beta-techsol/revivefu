import { type NextRequest, NextResponse } from "next/server"
import { createUser, findUserByEmail } from "@/lib/user-auth"
import { sendVerificationEmail } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Create user
    const user = await createUser({ email, password })

    // Send verification email
    const emailSent = await sendVerificationEmail(email, user.verification_token!)

    if (!emailSent) {
      console.error("Failed to send verification email to:", email)
    }

    return NextResponse.json({
      message: "Registration successful. Please check your email to verify your account.",
      userId: user.id,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
