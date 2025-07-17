import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/user-auth"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("user-token")?.value

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get fresh user data from database
    const [user] = await sql`
      SELECT id, email, first_name, last_name, phone, profile_picture_url, email_verified, is_active
      FROM users 
      WHERE id = ${decoded.id} AND is_active = true
    `

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      profile_picture_url: user.profile_picture_url,
      email_verified: user.email_verified,
    })
  } catch (error) {
    console.error("Auth verification error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  }
}
