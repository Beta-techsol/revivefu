import type { NextRequest } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find admin user
    const users = await sql`
      SELECT id, name, email, password_hash, role, is_active
      FROM admin_users 
      WHERE email = ${email} AND is_active = true
    `

    if (users.length === 0) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = users[0]

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" },
    )

    // Create response with HTTP-only cookie
    const response = Response.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })

    response.headers.set(
      "Set-Cookie",
      `admin_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`,
    )

    return response
  } catch (error) {
    console.error("Login error:", error)
    return Response.json({ error: "Login failed" }, { status: 500 })
  }
}
