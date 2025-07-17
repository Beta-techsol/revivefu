import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/user-auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json()

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await fetch(`${request.nextUrl.origin}/api/user/check-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    if (existingUser.ok) {
      const result = await existingUser.json()
      if (result.exists) {
        return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
      }
    }

    const user = await createUser(email, password, name, phone)

    if (!user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful! Please check your email to verify your account.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        email_verified: user.email_verified,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
