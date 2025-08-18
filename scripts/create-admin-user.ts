import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

async function createAdminUser() {
  try {
    const email = "admin@revivefurniture.com"
    const password = "betatech@p@$$"
    const name = "Admin User"
    const role = "super_admin"

    // Check if admin user already exists
    const existingUser = await sql`
      SELECT id FROM admin_users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      console.log("Admin user already exists with email:", email)
      return
    }

    // Hash the password using the same method as lib/auth.ts
    console.log("Hashing password...")
    const passwordHash = await bcrypt.hash(password, 12)

    // Insert the admin user
    console.log("Creating admin user...")
    const result = await sql`
      INSERT INTO admin_users (email, password_hash, name, role, is_active)
      VALUES (${email}, ${passwordHash}, ${name}, ${role}, true)
      RETURNING id, email, name, role
    `

    console.log("✅ Admin user created successfully!")
    console.log("User details:", result[0])
    console.log("\nLogin credentials:")
    console.log("Email:", email)
    console.log("Password:", password)
  } catch (error) {
    console.error("❌ Error creating admin user:", error)
  }
}

createAdminUser()
