import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface User {
  id: number
  email: string
  password_hash: string
  is_verified: boolean
  verification_token?: string
  verification_token_expires?: Date
  reset_token?: string
  reset_token_expires?: Date
  created_at: Date
  updated_at: Date
}

export interface CreateUserData {
  email: string
  password: string
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
export function generateJWT(userId: number, email: string): string {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET!, { expiresIn: "7d" })
}

// Verify JWT token
export function verifyJWT(token: string): { userId: number; email: string } | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; email: string }
  } catch {
    return null
  }
}

// Create user
export async function createUser(data: CreateUserData): Promise<User> {
  const { email, password } = data
  const passwordHash = await hashPassword(password)
  const verificationToken = generateSecureToken()
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  const result = await sql`
    INSERT INTO users (email, password_hash, verification_token, verification_token_expires)
    VALUES (${email}, ${passwordHash}, ${verificationToken}, ${verificationTokenExpires})
    RETURNING *
  `

  return result[0] as User
}

// Find user by email
export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email}
  `
  return (result[0] as User) || null
}

// Find user by ID
export async function findUserById(id: number): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE id = ${id}
  `
  return (result[0] as User) || null
}

// Verify email with token
export async function verifyEmailToken(token: string): Promise<boolean> {
  const result = await sql`
    UPDATE users 
    SET is_verified = true, verification_token = NULL, verification_token_expires = NULL
    WHERE verification_token = ${token} 
    AND verification_token_expires > NOW()
    RETURNING id
  `
  return result.length > 0
}

// Set password reset token
export async function setPasswordResetToken(email: string): Promise<string | null> {
  const resetToken = generateSecureToken()
  const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  const result = await sql`
    UPDATE users 
    SET reset_token = ${resetToken}, reset_token_expires = ${resetTokenExpires}
    WHERE email = ${email} AND is_verified = true
    RETURNING id
  `

  return result.length > 0 ? resetToken : null
}

// Reset password with token
export async function resetPasswordWithToken(token: string, newPassword: string): Promise<boolean> {
  const passwordHash = await hashPassword(newPassword)

  const result = await sql`
    UPDATE users 
    SET password_hash = ${passwordHash}, reset_token = NULL, reset_token_expires = NULL
    WHERE reset_token = ${token} 
    AND reset_token_expires > NOW()
    RETURNING id
  `

  return result.length > 0
}

// Authenticate user
export async function authenticateUser(data: LoginData): Promise<User | null> {
  const { email, password } = data
  const user = await findUserByEmail(email)

  if (!user || !user.is_verified) {
    return null
  }

  const isValid = await verifyPassword(password, user.password_hash)
  return isValid ? user : null
}
