import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    // Check if admin user already exists
    const existingAdmin = await sql`
      SELECT id FROM admin_users WHERE email = ${email}
    `

    if (existingAdmin.length > 0) {
      return NextResponse.json({ error: "Admin user with this email already exists" }, { status: 400 })
    }

    // Hash the password with 12 salt rounds (same as auth system)
    const hashedPassword = await bcrypt.hash(password, 12)

    // Insert the admin user
    await sql`
      INSERT INTO admin_users (name, email, password, role, is_active, created_at, updated_at)
      VALUES (
        ${name},
        ${email},
        ${hashedPassword},
        'super_admin',
        true,
        NOW(),
        NOW()
      )
    `

    return NextResponse.json({
      message: "Admin user created successfully! You can now login.",
    })
  } catch (error) {
    console.error("Admin setup error:", error)
    return NextResponse.json({ error: "Failed to create admin user" }, { status: 500 })
  }
}
