import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get user from database
    const user = await sql`
      SELECT id, email, name, role 
      FROM admin_users 
      WHERE id = ${decoded.userId}
    `

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    return NextResponse.json(user[0])
  } catch (error) {
    console.error("Auth verification error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  }
}
