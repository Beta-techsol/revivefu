import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function GET() {
  try {
    const adminUsers = await sql`
      SELECT id, email, name, role, is_active, created_at, last_login
      FROM admin_users
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      success: true,
      data: adminUsers,
    })
  } catch (error) {
    console.error("Error fetching admin users:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch admin users",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, password, role = "admin" } = await request.json()

    if (!email || !name || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email, name, and password are required",
        },
        { status: 400 },
      )
    }

    // Check if admin user already exists
    const existingUser = await sql`
      SELECT id FROM admin_users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Admin user with this email already exists",
        },
        { status: 409 },
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create admin user
    const result = await sql`
      INSERT INTO admin_users (email, name, role, password_hash, is_active, created_at, updated_at)
      VALUES (${email}, ${name}, ${role}, ${passwordHash}, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, email, name, role, is_active, created_at
    `

    return NextResponse.json({
      success: true,
      data: result[0],
    })
  } catch (error) {
    console.error("Error creating admin user:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create admin user",
      },
      { status: 500 },
    )
  }
}
