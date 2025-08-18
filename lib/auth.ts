import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"
import type { NextRequest } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface User {
  id: string
  email: string
  name: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )
}

export function verifyToken(token: string): User | null {
  try {
    return jwt.verify(token, JWT_SECRET) as User
  } catch {
    return null
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    console.log("[v0] Starting authentication for email:", email)
    console.log("[v0] DATABASE_URL exists:", !!process.env.DATABASE_URL)

    const [user] = await sql`
      SELECT id, email, name, role, password_hash, is_active
      FROM admin_users 
      WHERE email = ${email} AND is_active = true
    `

    console.log("[v0] Database query completed, user found:", !!user)

    if (!user) {
      console.log("[v0] No user found with email:", email)
      return null
    }

    console.log("[v0] User details - ID:", user.id, "Email:", user.email, "Role:", user.role, "Active:", user.is_active)
    console.log("[v0] Password hash length:", user.password_hash?.length || 0)
    console.log("[v0] Password hash prefix:", user.password_hash?.substring(0, 10) || "none")

    console.log("[v0] Verifying password for user:", user.email)
    const isValidPassword = await verifyPassword(password, user.password_hash)
    console.log("[v0] Password verification result:", isValidPassword)

    if (!isValidPassword) {
      console.log("[v0] Invalid password for user:", email)
      return null
    }

    // Update last login
    console.log("[v0] Updating last login for user:", user.id)
    await sql`
      UPDATE admin_users 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE id = ${user.id}
    `

    console.log("[v0] Authentication successful for user:", email)
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  } catch (error) {
    console.error("[v0] Authentication error details:", error)
    console.error("[v0] Error type:", typeof error)
    console.error("[v0] Error message:", error instanceof Error ? error.message : "Unknown error")
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return null
  }
}

export function requireAuth(handler: (request: NextRequest, context?: any) => Promise<Response>) {
  return async (request: NextRequest, context?: any) => {
    try {
      const authHeader = request.headers.get("authorization")
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
      }

      const token = authHeader.substring(7)
      const user = verifyToken(token)

      if (!user) {
        return Response.json({ error: "Invalid token" }, { status: 401 })
      }
      // Add user to request context
      ;(request as any).user = user

      return handler(request, context)
    } catch (error) {
      console.error("Auth middleware error:", error)
      return Response.json({ error: "Authentication failed" }, { status: 401 })
    }
  }
}
