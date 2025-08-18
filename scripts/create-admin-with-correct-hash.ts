import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

async function createAdminUser() {
  try {
    const email = "admin@revivefurniture.com"
    const password = "betatech@p@$$"
    const name = "Admin User"
    const role = "super_admin"

    console.log("🔍 Checking for existing admin user...")

    // Check if admin user already exists
    const existingUser = await sql`
      SELECT id, email, name FROM admin_users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      console.log("⚠️  Admin user already exists. Deleting and recreating...")
      await sql`DELETE FROM admin_users WHERE email = ${email}`
    }

    // Hash the password using the same method as lib/auth.ts
    console.log("🔐 Hashing password...")
    const passwordHash = await bcrypt.hash(password, 12)
    console.log("Password hash generated:", passwordHash.substring(0, 20) + "...")

    // Insert the admin user with correct column name
    console.log("👤 Creating admin user...")
    const result = await sql`
      INSERT INTO admin_users (email, password_hash, name, role, is_active, created_at, updated_at)
      VALUES (${email}, ${passwordHash}, ${name}, ${role}, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, email, name, role
    `

    console.log("✅ Admin user created successfully!")
    console.log("User details:", result[0])
    console.log("\n🔑 Login credentials:")
    console.log("Email:", email)
    console.log("Password:", password)
    console.log("\n🌐 You can now login at: /admin")

    // Test the authentication
    console.log("\n🧪 Testing authentication...")
    const testAuth = await sql`
      SELECT id, email, name, role, password_hash 
      FROM admin_users 
      WHERE email = ${email} AND is_active = true
    `

    if (testAuth.length > 0) {
      const isValidPassword = await bcrypt.compare(password, testAuth[0].password_hash)
      console.log("Password verification test:", isValidPassword ? "✅ PASSED" : "❌ FAILED")
    }
  } catch (error) {
    console.error("❌ Error creating admin user:", error)
  }
}

createAdminUser()
