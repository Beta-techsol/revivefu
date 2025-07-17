import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyJWT, hashPassword, verifyPassword } from "@/lib/user-auth"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Get JWT token from cookies
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify token
    const decoded = verifyJWT(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get user data
    const result = await sql`
      SELECT id, email, first_name, last_name, phone, profile_picture_url, created_at
      FROM users 
      WHERE id = ${decoded.userId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: result[0] })
  } catch (error) {
    console.error("Error fetching user settings:", error)
    return NextResponse.json({ error: "Failed to fetch user settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get JWT token from cookies
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify token
    const decoded = verifyJWT(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, email, phone, currentPassword, newPassword } = body

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "First name, last name, and email are required" }, { status: 400 })
    }

    // Check if email is already taken by another user
    const existingUser = await sql`
      SELECT id FROM users 
      WHERE email = ${email} AND id != ${decoded.userId}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email is already taken" }, { status: 400 })
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required to change password" }, { status: 400 })
      }

      // Get current user data
      const currentUser = await sql`
        SELECT password_hash FROM users WHERE id = ${decoded.userId}
      `

      if (currentUser.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Verify current password
      const isCurrentPasswordValid = await verifyPassword(currentPassword, currentUser[0].password_hash)

      if (!isCurrentPasswordValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
      }

      // Hash new password and update
      const newPasswordHash = await hashPassword(newPassword)

      await sql`
        UPDATE users SET
          first_name = ${firstName},
          last_name = ${lastName},
          email = ${email},
          phone = ${phone || null},
          password_hash = ${newPasswordHash},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${decoded.userId}
      `
    } else {
      // Update without password change
      await sql`
        UPDATE users SET
          first_name = ${firstName},
          last_name = ${lastName},
          email = ${email},
          phone = ${phone || null},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${decoded.userId}
      `
    }

    // Get updated user data
    const result = await sql`
      SELECT id, email, first_name, last_name, phone, profile_picture_url, created_at
      FROM users 
      WHERE id = ${decoded.userId}
    `

    return NextResponse.json({
      user: result[0],
      message: "Settings updated successfully",
    })
  } catch (error) {
    console.error("Error updating user settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
