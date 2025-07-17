import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"
import type { NextRequest } from "next/server"
import crypto from "crypto"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  profile_picture_url?: string
  email_verified: boolean
  is_active: boolean
  last_login?: Date
  created_at: Date
  updated_at: Date
}

export interface AuthUser {
  id: string
  email: string
  first_name: string
  last_name: string
  profile_picture_url?: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      profile_picture_url: user.profile_picture_url,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser
  } catch {
    return null
  }
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  try {
    const [user] = await sql`
      SELECT id, email, password_hash, first_name, last_name, profile_picture_url, email_verified, is_active
      FROM users 
      WHERE email = ${email} AND is_active = true
    `

    if (!user) {
      return null
    }

    if (!user.email_verified) {
      throw new Error("Please verify your email before logging in")
    }

    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return null
    }

    // Update last login
    await sql`
      UPDATE users 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE id = ${user.id}
    `

    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      profile_picture_url: user.profile_picture_url,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    throw error
  }
}

export async function createUser(userData: {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
}): Promise<{ user: AuthUser; emailVerificationToken: string }> {
  try {
    // Check if user already exists
    const [existingUser] = await sql`
      SELECT id FROM users WHERE email = ${userData.email}
    `

    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    const hashedPassword = await hashPassword(userData.password)
    const emailVerificationToken = crypto.randomBytes(32).toString("hex")

    const [user] = await sql`
      INSERT INTO users (
        email, password_hash, first_name, last_name, phone, email_verification_token
      )
      VALUES (
        ${userData.email}, ${hashedPassword}, ${userData.first_name}, 
        ${userData.last_name}, ${userData.phone || null}, ${emailVerificationToken}
      )
      RETURNING id, email, first_name, last_name, profile_picture_url
    `

    return {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_picture_url: user.profile_picture_url,
      },
      emailVerificationToken,
    }
  } catch (error) {
    console.error("User creation error:", error)
    throw error
  }
}

export async function verifyEmail(token: string): Promise<boolean> {
  try {
    const [user] = await sql`
      SELECT id FROM users 
      WHERE email_verification_token = ${token} AND email_verified = false
    `

    if (!user) {
      return false
    }

    await sql`
      UPDATE users 
      SET email_verified = true, email_verification_token = null 
      WHERE id = ${user.id}
    `

    return true
  } catch (error) {
    console.error("Email verification error:", error)
    return false
  }
}

export async function generatePasswordResetToken(email: string): Promise<string | null> {
  try {
    const [user] = await sql`
      SELECT id FROM users WHERE email = ${email} AND is_active = true
    `

    if (!user) {
      return null
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 3600000) // 1 hour from now

    await sql`
      UPDATE users 
      SET password_reset_token = ${resetToken}, password_reset_expires = ${expiresAt}
      WHERE id = ${user.id}
    `

    return resetToken
  } catch (error) {
    console.error("Password reset token generation error:", error)
    return null
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  try {
    const [user] = await sql`
      SELECT id FROM users 
      WHERE password_reset_token = ${token} 
      AND password_reset_expires > CURRENT_TIMESTAMP
    `

    if (!user) {
      return false
    }

    const hashedPassword = await hashPassword(newPassword)

    await sql`
      UPDATE users 
      SET password_hash = ${hashedPassword}, 
          password_reset_token = null, 
          password_reset_expires = null
      WHERE id = ${user.id}
    `

    return true
  } catch (error) {
    console.error("Password reset error:", error)
    return false
  }
}

export function requireUserAuth(handler: (request: NextRequest, context?: any) => Promise<Response>) {
  return async (request: NextRequest, context?: any) => {
    try {
      const token = request.cookies.get("user-token")?.value

      if (!token) {
        return Response.json({ error: "Authentication required" }, { status: 401 })
      }

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
