import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Verify admin user still exists and is active
    const [user] = await sql`
      SELECT id, email, name, role, is_active, last_login
      FROM admin_users 
      WHERE id = ${decoded.id} AND is_active = true
    `

    if (!user) {
      return NextResponse.json({ error: "Admin user not found or inactive" }, { status: 401 })
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      lastLogin: user.last_login,
    })
  } catch (error) {
    console.error("Get admin user error:", error)
    return NextResponse.json({ error: "Failed to get admin user" }, { status: 500 })
  }
}
