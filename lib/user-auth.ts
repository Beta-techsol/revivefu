import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"
import crypto from "crypto"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  profilePictureUrl?: string
  emailVerified: boolean
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
      firstName: user.firstName,
      lastName: user.lastName,
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

export async function createUser(userData: {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}): Promise<User | null> {
  try {
    const hashedPassword = await hashPassword(userData.password)
    const emailVerificationToken = crypto.randomBytes(32).toString("hex")

    const [user] = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, phone, email_verification_token)
      VALUES (${userData.email}, ${hashedPassword}, ${userData.firstName}, ${userData.lastName}, ${userData.phone || null}, ${emailVerificationToken})
      RETURNING id, email, first_name, last_name, phone, profile_picture_url, email_verified
    `

    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      profilePictureUrl: user.profile_picture_url,
      emailVerified: user.email_verified,
    }
  } catch (error) {
    console.error("Create user error:", error)
    return null
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const [user] = await sql`
      SELECT id, email, password_hash, first_name, last_name, phone, profile_picture_url, email_verified, is_active
      FROM users 
      WHERE email = ${email} AND is_active = true
    `

    if (!user) return null

    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) return null

    // Update last login
    await sql`
      UPDATE users 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE id = ${user.id}
    `

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      profilePictureUrl: user.profile_picture_url,
      emailVerified: user.email_verified,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const [user] = await sql`
      SELECT id, email, first_name, last_name, phone, profile_picture_url, email_verified
      FROM users 
      WHERE id = ${id} AND is_active = true
    `

    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      profilePictureUrl: user.profile_picture_url,
      emailVerified: user.email_verified,
    }
  } catch (error) {
    console.error("Get user error:", error)
    return null
  }
}

export async function updateUserProfile(
  userId: string,
  updates: {
    firstName?: string
    lastName?: string
    profilePictureUrl?: string
  },
): Promise<User | null> {
  try {
    const setParts = []
    const values = []

    if (updates.firstName !== undefined) {
      setParts.push(`first_name = $${setParts.length + 1}`)
      values.push(updates.firstName)
    }
    if (updates.lastName !== undefined) {
      setParts.push(`last_name = $${setParts.length + 1}`)
      values.push(updates.lastName)
    }
    if (updates.profilePictureUrl !== undefined) {
      setParts.push(`profile_picture_url = $${setParts.length + 1}`)
      values.push(updates.profilePictureUrl)
    }

    if (setParts.length === 0) return null

    values.push(userId)
    const query = `
      UPDATE users 
      SET ${setParts.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${values.length}
      RETURNING id, email, first_name, last_name, phone, profile_picture_url, email_verified
    `

    const [user] = await sql.unsafe(query, values)

    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      profilePictureUrl: user.profile_picture_url,
      emailVerified: user.email_verified,
    }
  } catch (error) {
    console.error("Update user profile error:", error)
    return null
  }
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
  try {
    const [user] = await sql`
      SELECT password_hash FROM users WHERE id = ${userId}
    `

    if (!user) return false

    const isValidPassword = await verifyPassword(currentPassword, user.password_hash)
    if (!isValidPassword) return false

    const hashedNewPassword = await hashPassword(newPassword)

    await sql`
      UPDATE users 
      SET password_hash = ${hashedNewPassword}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `

    return true
  } catch (error) {
    console.error("Change password error:", error)
    return false
  }
}

export async function generatePasswordResetToken(email: string): Promise<string | null> {
  try {
    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 3600000) // 1 hour

    const [user] = await sql`
      UPDATE users 
      SET password_reset_token = ${token}, password_reset_expires = ${expires}
      WHERE email = ${email} AND is_active = true
      RETURNING id
    `

    return user ? token : null
  } catch (error) {
    console.error("Generate password reset token error:", error)
    return null
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  try {
    const [user] = await sql`
      SELECT id FROM users 
      WHERE password_reset_token = ${token} 
      AND password_reset_expires > CURRENT_TIMESTAMP
      AND is_active = true
    `

    if (!user) return false

    const hashedPassword = await hashPassword(newPassword)

    await sql`
      UPDATE users 
      SET password_hash = ${hashedPassword}, 
          password_reset_token = NULL, 
          password_reset_expires = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${user.id}
    `

    return true
  } catch (error) {
    console.error("Reset password error:", error)
    return false
  }
}
