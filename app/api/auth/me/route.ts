import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "No authentication token",
        },
        { status: 401 },
      )
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    // Get fresh user data from database
    const users = await sql`
      SELECT id, name, email, role, created_at
      FROM users 
      WHERE id = ${decoded.userId}
    `

    if (users.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
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
        created_at: user.created_at,
      },
    })
  } catch (error) {
    console.error("Auth verification error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Invalid token",
      },
      { status: 401 },
    )
  }
}
