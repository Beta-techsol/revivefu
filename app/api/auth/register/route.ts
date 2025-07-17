import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/user-auth"
import { sendVerificationEmail } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone } = await request.json()

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // Create user
    const user = await createUser({
      email,
      password,
      firstName,
      lastName,
      phone,
    })

    // Try to send verification email (but don't fail if it doesn't work)
    try {
      await sendVerificationEmail(email, user.email_verification_token!)
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
      // Continue without failing the registration
    }

    return NextResponse.json({
      success: true,
      message:
        "Account created successfully! Please check your email to verify your account. (Note: Email verification is currently disabled for testing)",
      userId: user.id,
    })
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 })
  }
}
