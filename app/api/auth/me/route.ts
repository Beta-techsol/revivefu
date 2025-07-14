import type { NextRequest } from "next/server"
import { neon } from "@neondatabase/serverless"
import jwt from "jsonwebtoken"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin_token")?.value

    if (!token) {
      return Response.json({ error: "Not authenticated" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    const users = await sql`
      SELECT id, name, email, role
      FROM admin_users 
      WHERE id = ${decoded.userId} AND is_active = true
    `

    if (users.length === 0) {
      return Response.json({ error: "User not found" }, { status: 401 })
    }

    return Response.json({ user: users[0] })
  } catch (error) {
    return Response.json({ error: "Invalid token" }, { status: 401 })
  }
}
