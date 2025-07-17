import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"
import type { NextRequest } from "next/server"
import crypto from "crypto"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  profile_picture?: string
  email_verified: boolean
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
      profile_picture: user.profile_picture,
    },
    JWT_SECRET,
    { expiresIn: "30d" },
  )
}

export function verifyToken(token: string): User | null {
  try {
    return jwt.verify(token, JWT_SECRET) as User
  } catch {
    return null
  }
}

export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export async function createUser(email: string, password: string, name: string, phone?: string): Promise<User | null> {
  try {
    const hashedPassword = await hashPassword(password)
    const verificationToken = generateVerificationToken()

    const [user] = await sql`
      INSERT INTO users (email, password_hash, name, phone, email_verification_token)
      VALUES (${email}, ${hashedPassword}, ${name}, ${phone || null}, ${verificationToken})
      RETURNING id, email, name, phone, profile_picture, email_verified
    `

    if (!user) return null

    // Send verification email (we'll implement this)
    await sendVerificationEmail(email, name, verificationToken)

    return user
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const [user] = await sql`
      SELECT id, email, name, phone, profile_picture, email_verified, password_hash
      FROM users 
      WHERE email = ${email} AND is_active = true
    `

    if (!user) return null

    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      profile_picture: user.profile_picture,
      email_verified: user.email_verified,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export async function verifyEmail(token: string): Promise<boolean> {
  try {
    const [user] = await sql`
      UPDATE users 
      SET email_verified = true, email_verification_token = null
      WHERE email_verification_token = ${token}
      RETURNING id
    `
    return !!user
  } catch (error) {
    console.error("Email verification error:", error)
    return false
  }
}

export async function requestPasswordReset(email: string): Promise<boolean> {
  try {
    const resetToken = generateVerificationToken()
    const resetExpires = new Date(Date.now() + 3600000) // 1 hour

    const [user] = await sql`
      UPDATE users 
      SET password_reset_token = ${resetToken}, password_reset_expires = ${resetExpires}
      WHERE email = ${email} AND is_active = true
      RETURNING id, name
    `

    if (!user) return false

    // Send password reset email
    await sendPasswordResetEmail(email, user.name, resetToken)
    return true
  } catch (error) {
    console.error("Password reset request error:", error)
    return false
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  try {
    const hashedPassword = await hashPassword(newPassword)

    const [user] = await sql`
      UPDATE users 
      SET password_hash = ${hashedPassword}, password_reset_token = null, password_reset_expires = null
      WHERE password_reset_token = ${token} AND password_reset_expires > CURRENT_TIMESTAMP
      RETURNING id
    `

    return !!user
  } catch (error) {
    console.error("Password reset error:", error)
    return false
  }
}

async function sendVerificationEmail(email: string, name: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const verificationUrl = `${baseUrl}/auth/verify-email?token=${token}`

  try {
    const response = await fetch(`${baseUrl}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        subject: "Verify Your Email - Revive Furniture",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #C53D39;">Welcome to Revive Furniture!</h2>
            <p>Hi ${name},</p>
            <p>Thank you for registering with Revive Furniture. Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background-color: #C53D39; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all;">${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>Best regards,<br>The Revive Furniture Team</p>
          </div>
        `,
      }),
    })
  } catch (error) {
    console.error("Failed to send verification email:", error)
  }
}

async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`

  try {
    const response = await fetch(`${baseUrl}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        subject: "Reset Your Password - Revive Furniture",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #C53D39;">Password Reset Request</h2>
            <p>Hi ${name},</p>
            <p>You requested to reset your password for your Revive Furniture account. Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #C53D39; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all;">${resetUrl}</p>
            <p>This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.</p>
            <p>Best regards,<br>The Revive Furniture Team</p>
          </div>
        `,
      }),
    })
  } catch (error) {
    console.error("Failed to send password reset email:", error)
  }
}

export function requireUserAuth(handler: (request: NextRequest, context?: any) => Promise<Response>) {
  return async (request: NextRequest, context?: any) => {
    try {
      const token = request.cookies.get("user-token")?.value

      if (!token) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
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
