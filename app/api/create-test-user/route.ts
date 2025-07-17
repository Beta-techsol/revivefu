import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    // Hash the password
    const passwordHash = await bcrypt.hash("123456789", 12)

    // Insert or update test user
    const result = await sql`
      INSERT INTO users (
        email, 
        password_hash, 
        first_name, 
        last_name, 
        phone, 
        email_verified, 
        is_active
      ) VALUES (
        'test@mail.com',
        ${passwordHash},
        'Test',
        'User',
        '+1234567890',
        true,
        true
      ) ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        email_verified = EXCLUDED.email_verified,
        is_active = EXCLUDED.is_active
      RETURNING id, email, first_name, last_name
    `

    return NextResponse.json({
      success: true,
      message: "Test user created successfully",
      user: result[0],
    })
  } catch (error) {
    console.error("Error creating test user:", error)
    return NextResponse.json({ error: "Failed to create test user" }, { status: 500 })
  }
}
