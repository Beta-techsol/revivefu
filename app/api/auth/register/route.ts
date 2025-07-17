import { type NextRequest, NextResponse } from "next/server"
import { createUser, findUserByEmail } from "@/lib/user-auth"
import { sendVerificationEmail } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone } = await request.json()

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        {
          error: "Email, password, first name, and last name are required",
        },
        { status: 400 },
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          error: "Password must be at least 6 characters long",
        },
        { status: 400 },
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: "Please enter a valid email address",
        },
        { status: 400 },
      )
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        {
          error: "User with this email already exists",
        },
        { status: 400 },
      )
    }

    // Create user
    const user = await createUser({
      email,
      password,
      firstName,
      lastName,
      phone,
    })

    // Send verification email
    const emailSent = await sendVerificationEmail(email, user.email_verification_token!)

    if (!emailSent) {
      console.error("Failed to send verification email to:", email)
    }

    return NextResponse.json({
      message: "Registration successful. Please check your email to verify your account.",
      userId: user.id,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        error: "Registration failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
