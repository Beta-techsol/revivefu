import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyPassword } from "@/lib/user-auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `

    const user = result[0]

    if (!user) {
      return NextResponse.json({
        found: false,
        message: "User not found",
      })
    }

    // Check password
    const passwordValid = await verifyPassword(password, user.password_hash)

    return NextResponse.json({
      found: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        emailVerified: user.email_verified,
        isActive: user.is_active,
        hasPassword: !!user.password_hash,
        passwordValid,
      },
      debug: {
        passwordHash: user.password_hash.substring(0, 20) + "...",
        createdAt: user.created_at,
        lastLogin: user.last_login,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Debug check failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
