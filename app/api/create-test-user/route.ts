import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { hashPassword } from "@/lib/user-auth"

export async function POST() {
  try {
    // Hash the password
    const passwordHash = await hashPassword("123456789")

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
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      message: "Test user created successfully",
      user: {
        email: result[0].email,
        firstName: result[0].first_name,
        lastName: result[0].last_name,
        emailVerified: result[0].email_verified,
        isActive: result[0].is_active,
      },
    })
  } catch (error) {
    console.error("Error creating test user:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create test user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
