import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser as authenticateRegularUser, generateJWT } from "@/lib/user-auth"
import { authenticateUser as authenticateAdminUser, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log("Login attempt for:", email)

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const adminUser = await authenticateAdminUser(email, password)

    if (adminUser) {
      console.log("Admin authentication successful for:", email)

      // Generate admin token
      const token = generateToken(adminUser)

      // Create response with admin user data
      const response = NextResponse.json({
        message: "Admin login successful",
        user: {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
          isAdmin: true,
        },
      })

      // Set HTTP-only cookie for admin
      response.cookies.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      })

      return response
    }

    const user = await authenticateRegularUser({ email, password })

    if (!user) {
      console.log("Authentication failed for:", email)
      return NextResponse.json(
        {
          error: "Invalid credentials or email not verified",
        },
        { status: 401 },
      )
    }

    console.log("User authentication successful for:", email)

    // Generate JWT token for regular user
    const token = generateJWT(user.id, user.email)

    // Create response with regular user data
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        emailVerified: user.email_verified,
        isAdmin: false,
      },
    })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
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
