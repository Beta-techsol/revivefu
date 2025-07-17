import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, generateJWT } from "@/lib/user-auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Authenticate user
    const user = await authenticateUser({ email, password })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials or email not verified" }, { status: 401 })
    }

    // Generate JWT token
    const token = generateJWT(user.id, user.email)

    // Create response with cookie
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        isVerified: user.is_verified,
      },
    })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        error: "Login failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
