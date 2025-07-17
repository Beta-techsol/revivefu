import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyJWT, hashPassword, verifyPassword } from "@/lib/user-auth"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/account/settings - Starting")

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
      SELECT id, email, first_name, last_name, phone, profile_picture_url, 
             email_verified, is_active, last_login, created_at
      FROM users 
      WHERE id = ${decoded.userId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = result[0]
    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error fetching user settings:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch user settings",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("PUT /api/account/settings - Starting")

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
    const { firstName, lastName, phone, email, currentPassword, newPassword, profilePictureUrl } = body

    console.log("Update request:", {
      firstName,
      lastName,
      phone,
      email,
      hasCurrentPassword: !!currentPassword,
      hasNewPassword: !!newPassword,
      profilePictureUrl,
    })

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required to change password" }, { status: 400 })
      }

      // Get current user with password
      const userResult = await sql`
        SELECT password_hash FROM users WHERE id = ${decoded.userId}
      `

      if (userResult.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      const isCurrentPasswordValid = await verifyPassword(currentPassword, userResult[0].password_hash)
      if (!isCurrentPasswordValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
      }

      // Validate new password
      if (newPassword.length < 6) {
        return NextResponse.json({ error: "New password must be at least 6 characters long" }, { status: 400 })
      }

      // Hash new password
      const newPasswordHash = await hashPassword(newPassword)

      // Update user with new password
      const result = await sql`
        UPDATE users 
        SET first_name = ${firstName}, 
            last_name = ${lastName}, 
            phone = ${phone || null},
            email = ${email},
            password_hash = ${newPasswordHash},
            profile_picture_url = ${profilePictureUrl || null},
            updated_at = NOW()
        WHERE id = ${decoded.userId}
        RETURNING id, email, first_name, last_name, phone, profile_picture_url, 
                 email_verified, is_active, last_login, created_at
      `

      return NextResponse.json({
        user: result[0],
        message: "Profile and password updated successfully",
      })
    } else {
      // Update user without password change
      const result = await sql`
        UPDATE users 
        SET first_name = ${firstName}, 
            last_name = ${lastName}, 
            phone = ${phone || null},
            email = ${email},
            profile_picture_url = ${profilePictureUrl || null},
            updated_at = NOW()
        WHERE id = ${decoded.userId}
        RETURNING id, email, first_name, last_name, phone, profile_picture_url, 
                 email_verified, is_active, last_login, created_at
      `

      if (result.length === 0) {
        return NextResponse.json({ error: "User not found or update failed" }, { status: 404 })
      }

      return NextResponse.json({
        user: result[0],
        message: "Profile updated successfully",
      })
    }
  } catch (error) {
    console.error("Error updating user settings:", error)

    // Handle unique constraint violation for email
    if (error instanceof Error && error.message.includes("duplicate key value violates unique constraint")) {
      return NextResponse.json({ error: "Email address is already in use" }, { status: 400 })
    }

    return NextResponse.json(
      {
        error: "Failed to update user settings",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
