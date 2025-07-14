import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import type { NextRequest } from "next/server"
import { sql } from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret-key"

export interface AdminUser {
  id: number
  email: string
  name: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(payload: { userId: number; email: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): { userId: number; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string }
  } catch (error) {
    return null
  }
}

export async function getAuthenticatedUser(request: NextRequest): Promise<AdminUser | null> {
  const token =
    request.headers.get("authorization")?.replace("Bearer ", "") || request.cookies.get("admin-token")?.value

  if (!token) return null

  const decoded = verifyToken(token)
  if (!decoded) return null

  try {
    // Verify user still exists in database
    const users = await sql`
      SELECT id, email, name, role 
      FROM admin_users 
      WHERE id = ${decoded.userId}
    `

    return users[0] || null
  } catch (error) {
    console.error("Database auth check error:", error)
    return null
  }
}

export function requireAuth(handler: Function) {
  return async (request: NextRequest, context: any) => {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }
    // Add user to request context
    ;(request as any).user = user
    return handler(request, context)
  }
}
