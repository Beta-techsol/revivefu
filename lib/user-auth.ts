import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  profilePictureUrl?: string
  emailVerified: boolean
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface UpdateUserData {
  firstName?: string
  lastName?: string
  profilePictureUrl?: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Create a new user
export async function createUser(userData: CreateUserData): Promise<User | null> {
  try {
    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${userData.email}
    `

    if (existingUser.length > 0) {
      return null // User already exists
    }

    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, 12)

    // Insert user
    const result = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, phone, email_verified)
      VALUES (${userData.email}, ${passwordHash}, ${userData.firstName}, ${userData.lastName}, ${userData.phone || null}, true)
      RETURNING id, email, first_name, last_name, phone, profile_picture_url, email_verified, is_active, last_login, created_at, updated_at
    `

    if (result.length === 0) {
      return null
    }

    const user = result[0]
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      profilePictureUrl: user.profile_picture_url,
      emailVerified: user.email_verified,
      isActive: user.is_active,
      lastLogin: user.last_login,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

// Authenticate user
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT id, email, password_hash, first_name, last_name, phone, profile_picture_url, 
             email_verified, is_active, last_login, created_at, updated_at
      FROM users 
      WHERE email = ${email} AND is_active = true
    `

    if (result.length === 0) {
      return null
    }

    const user = result[0]
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

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
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      profilePictureUrl: user.profile_picture_url,
      emailVerified: user.email_verified,
      isActive: user.is_active,
      lastLogin: new Date(),
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }
  } catch (error) {
    console.error("Error authenticating user:", error)
    return null
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT id, email, first_name, last_name, phone, profile_picture_url, 
             email_verified, is_active, last_login, created_at, updated_at
      FROM users 
      WHERE id = ${id} AND is_active = true
    `

    if (result.length === 0) {
      return null
    }

    const user = result[0]
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      profilePictureUrl: user.profile_picture_url,
      emailVerified: user.email_verified,
      isActive: user.is_active,
      lastLogin: user.last_login,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

// Update user profile
export async function updateUserProfile(id: string, updates: UpdateUserData): Promise<User | null> {
  try {
    const result = await sql`
      UPDATE users 
      SET 
        first_name = COALESCE(${updates.firstName}, first_name),
        last_name = COALESCE(${updates.lastName}, last_name),
        profile_picture_url = COALESCE(${updates.profilePictureUrl}, profile_picture_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND is_active = true
      RETURNING id, email, first_name, last_name, phone, profile_picture_url, 
                email_verified, is_active, last_login, created_at, updated_at
    `

    if (result.length === 0) {
      return null
    }

    const user = result[0]
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      profilePictureUrl: user.profile_picture_url,
      emailVerified: user.email_verified,
      isActive: user.is_active,
      lastLogin: user.last_login,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return null
  }
}

// Change password
export async function changePassword(id: string, currentPassword: string, newPassword: string): Promise<boolean> {
  try {
    // Get current password hash
    const result = await sql`
      SELECT password_hash FROM users WHERE id = ${id} AND is_active = true
    `

    if (result.length === 0) {
      return false
    }

    const isValidPassword = await bcrypt.compare(currentPassword, result[0].password_hash)
    if (!isValidPassword) {
      return false
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12)

    // Update password
    await sql`
      UPDATE users 
      SET password_hash = ${newPasswordHash}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    return true
  } catch (error) {
    console.error("Error changing password:", error)
    return false
  }
}

// Generate password reset token
export async function generatePasswordResetToken(email: string): Promise<string | null> {
  try {
    const result = await sql`
      SELECT id FROM users WHERE email = ${email} AND is_active = true
    `

    if (result.length === 0) {
      return null
    }

    const token = jwt.sign({ email, type: "password-reset" }, JWT_SECRET, { expiresIn: "1h" })
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await sql`
      UPDATE users 
      SET password_reset_token = ${token}, password_reset_expires = ${expires}
      WHERE email = ${email}
    `

    return token
  } catch (error) {
    console.error("Error generating password reset token:", error)
    return null
  }
}

// Reset password with token
export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any
    if (decoded.type !== "password-reset") {
      return false
    }

    // Check if token exists and is not expired
    const result = await sql`
      SELECT id FROM users 
      WHERE password_reset_token = ${token} 
        AND password_reset_expires > CURRENT_TIMESTAMP
        AND is_active = true
    `

    if (result.length === 0) {
      return false
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12)

    // Update password and clear reset token
    await sql`
      UPDATE users 
      SET 
        password_hash = ${passwordHash},
        password_reset_token = NULL,
        password_reset_expires = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE password_reset_token = ${token}
    `

    return true
  } catch (error) {
    console.error("Error resetting password:", error)
    return false
  }
}

// Generate JWT token
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

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}
