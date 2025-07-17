import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface User {
  id: string
  email: string
  password_hash: string
  first_name: string
  last_name: string
  phone?: string
  profile_picture_url?: string
  email_verified: boolean
  email_verification_token?: string
  password_reset_token?: string
  password_reset_expires?: Date
  is_active: boolean
  last_login?: Date
  created_at: Date
  updated_at: Date
}

export interface CreateUserData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface LoginData {
  email: string
  password: string
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Generate secure token
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

// Generate JWT token
export function generateJWT(userId: string, email: string): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET is not configured")
  }
  return jwt.sign({ userId, email }, secret, { expiresIn: "7d" })
}

// Verify JWT token
export function verifyJWT(token: string): { userId: string; email: string } | null {
  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error("JWT_SECRET is not configured")
    }
    return jwt.verify(token, secret) as { userId: string; email: string }
  } catch {
    return null
  }
}

// Verify token and get user
export async function verifyToken(token: string): Promise<User | null> {
  try {
    const decoded = verifyJWT(token)
    if (!decoded) {
      return null
    }

    const user = await findUserById(decoded.userId)
    return user
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

// Create user
export async function createUser(data: CreateUserData): Promise<User> {
  const { email, password, firstName, lastName, phone } = data
  const passwordHash = await hashPassword(password)
  const verificationToken = generateSecureToken()

  const result = await sql`
    INSERT INTO users (email, password_hash, first_name, last_name, phone, email_verification_token)
    VALUES (${email}, ${passwordHash}, ${firstName}, ${lastName}, ${phone || null}, ${verificationToken})
    RETURNING *
  `

  return result[0] as User
}

// Find user by email
export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `
    return (result[0] as User) || null
  } catch (error) {
    console.error("Error finding user by email:", error)
    return null
  }
}

// Find user by ID
export async function findUserById(id: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT * FROM users WHERE id = ${id}
    `
    return (result[0] as User) || null
  } catch (error) {
    console.error("Error finding user by ID:", error)
    return null
  }
}

// Verify email with token
export async function verifyEmailToken(token: string): Promise<boolean> {
  try {
    const result = await sql`
      UPDATE users 
      SET email_verified = true, email_verification_token = NULL
      WHERE email_verification_token = ${token}
      RETURNING id
    `
    return result.length > 0
  } catch (error) {
    console.error("Error verifying email token:", error)
    return false
  }
}

// Set password reset token
export async function setPasswordResetToken(email: string): Promise<string | null> {
  try {
    const resetToken = generateSecureToken()
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    const result = await sql`
      UPDATE users 
      SET password_reset_token = ${resetToken}, password_reset_expires = ${resetTokenExpires}
      WHERE email = ${email} AND email_verified = true
      RETURNING id
    `

    return result.length > 0 ? resetToken : null
  } catch (error) {
    console.error("Error setting password reset token:", error)
    return null
  }
}

// Reset password with token
export async function resetPasswordWithToken(token: string, newPassword: string): Promise<boolean> {
  try {
    const passwordHash = await hashPassword(newPassword)

    const result = await sql`
      UPDATE users 
      SET password_hash = ${passwordHash}, password_reset_token = NULL, password_reset_expires = NULL
      WHERE password_reset_token = ${token} 
      AND password_reset_expires > NOW()
      RETURNING id
    `

    return result.length > 0
  } catch (error) {
    console.error("Error resetting password:", error)
    return false
  }
}

// Authenticate user
export async function authenticateUser(data: LoginData): Promise<User | null> {
  try {
    const { email, password } = data
    console.log("Authenticating user:", email)

    const user = await findUserByEmail(email)
    console.log("User found:", user ? "Yes" : "No")

    if (!user) {
      console.log("User not found")
      return null
    }

    console.log("User email_verified:", user.email_verified)
    console.log("User is_active:", user.is_active)

    if (!user.email_verified || !user.is_active) {
      console.log("User not verified or not active")
      return null
    }

    const isValid = await verifyPassword(password, user.password_hash)
    console.log("Password valid:", isValid)

    if (!isValid) {
      return null
    }

    // Update last login
    await sql`
      UPDATE users 
      SET last_login = NOW()
      WHERE id = ${user.id}
    `

    return user
  } catch (error) {
    console.error("Error authenticating user:", error)
    return null
  }
}
