import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST() {
  try {
    console.log("🚀 Setting up users table...")

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        profile_picture_url TEXT,
        email_verified BOOLEAN DEFAULT false,
        email_verification_token VARCHAR(255),
        password_reset_token VARCHAR(255),
        password_reset_expires TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email_verification_token ON users(email_verification_token)`
    await sql`CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users(password_reset_token)`

    // Create trigger for updated_at
    await sql`
      CREATE OR REPLACE FUNCTION update_users_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `

    await sql`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users
    `

    await sql`
      CREATE TRIGGER update_users_updated_at 
          BEFORE UPDATE ON users 
          FOR EACH ROW 
          EXECUTE FUNCTION update_users_updated_at()
    `

    // Hash password for sample users
    const hashedPassword = await bcrypt.hash("password123", 12)

    // Insert sample users
    await sql`
      INSERT INTO users (
        email, 
        password_hash, 
        first_name, 
        last_name, 
        phone, 
        email_verified, 
        is_active
      ) VALUES
      (
        'john.doe@example.com',
        ${hashedPassword},
        'John',
        'Doe',
        '+92 300 1234567',
        true,
        true
      ),
      (
        'jane.smith@example.com',
        ${hashedPassword},
        'Jane',
        'Smith',
        '+92 300 7654321',
        true,
        true
      ),
      (
        'sarah.johnson@example.com',
        ${hashedPassword},
        'Sarah',
        'Johnson',
        '+92 300 1122334',
        true,
        true
      )
      ON CONFLICT (email) DO NOTHING
    `

    console.log("✅ Users table setup completed successfully!")

    return NextResponse.json({
      success: true,
      message: "Users table setup completed successfully!",
      testCredentials: {
        email: "john.doe@example.com",
        password: "password123",
      },
    })
  } catch (error: any) {
    console.error("❌ Users table setup failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.stack,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return POST()
}
