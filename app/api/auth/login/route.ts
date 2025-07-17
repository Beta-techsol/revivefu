import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, generateToken } from "@/lib/user-auth"
import { loginSchema } from "@/lib/validations/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = loginSchema.parse(body)

    // Authenticate user
    const user = await authenticateUser(validatedData.email, validatedData.password)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Generate token
    const token = generateToken(user)

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_picture_url: user.profile_picture_url,
      },
    })

    // Set HTTP-only cookie
    response.cookies.set("user-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error: any) {
    console.error("Login error:", error)

    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: error.message || "Login failed" }, { status: 400 })
  }
}
