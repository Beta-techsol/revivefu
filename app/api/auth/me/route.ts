import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    const token =
      request.cookies.get("auth-token")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "No authentication token provided",
        },
        { status: 401 },
      )
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-key") as {
      userId: number
      email: string
      role: string
    }

    // Get user from database
    const users = await sql`
      SELECT id, name, email, role, is_active
      FROM admin_users 
      WHERE id = ${decoded.userId} AND is_active = true
    `

    if (users.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found or inactive",
        },
        { status: 401 },
      )
    }

    const user = users[0]

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Auth verification error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Invalid or expired token",
      },
      { status: 401 },
    )
  }
}
