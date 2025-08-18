import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

async function fixAdminPassword() {
  try {
    const email = "admin@revivefurniture.com"
    const password = "betatech@p@$$"
    const name = "Admin User"
    const role = "super_admin"

    console.log("🔧 Starting comprehensive admin password fix...")

    // First, check if admin_users table exists and has correct structure
    console.log("🔍 Checking admin_users table structure...")

    try {
      const tableCheck = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'admin_users'
        ORDER BY ordinal_position
      `
      console.log("Admin users table columns:", tableCheck)
    } catch (error) {
      console.log("⚠️ Could not check table structure:", error)
    }

    // Check current admin user
    console.log("🔍 Checking current admin user...")
    const currentUser = await sql`
      SELECT id, email, password_hash, name, role, is_active,
             LENGTH(password_hash) as hash_length,
             SUBSTRING(password_hash, 1, 10) as hash_prefix
      FROM admin_users 
      WHERE email = ${email}
    `

    if (currentUser.length === 0) {
      console.log("❌ No admin user found. Creating new admin user...")

      // Create new admin user
      const passwordHash = await bcrypt.hash(password, 12)

      await sql`
        INSERT INTO admin_users (email, password_hash, name, role, is_active, created_at, updated_at)
        VALUES (${email}, ${passwordHash}, ${name}, ${role}, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `

      console.log("✅ New admin user created successfully!")
    } else {
      console.log("📋 Current admin user details:")
      console.log("  ID:", currentUser[0].id)
      console.log("  Email:", currentUser[0].email)
      console.log("  Name:", currentUser[0].name)
      console.log("  Role:", currentUser[0].role)
      console.log("  Active:", currentUser[0].is_active)
      console.log("  Hash Length:", currentUser[0].hash_length)
      console.log("  Hash Prefix:", currentUser[0].hash_prefix)

      // Test current password
      const currentPasswordWorks = await bcrypt.compare(password, currentUser[0].password_hash)
      console.log("🔐 Current password works:", currentPasswordWorks)

      if (!currentPasswordWorks) {
        console.log("🔄 Updating password hash...")

        // Generate new correct hash
        const newPasswordHash = await bcrypt.hash(password, 12)
        console.log("🔒 New hash generated (length:", newPasswordHash.length, ")")

        // Test the new hash before updating
        const newHashWorks = await bcrypt.compare(password, newPasswordHash)
        console.log("✅ New hash verification test:", newHashWorks)

        if (!newHashWorks) {
          console.log("❌ New hash failed verification test!")
          return
        }

        // Update the admin user
        await sql`
          UPDATE admin_users 
          SET password_hash = ${newPasswordHash}, 
              name = ${name},
              role = ${role},
              is_active = true,
              updated_at = CURRENT_TIMESTAMP
          WHERE email = ${email}
        `

        console.log("✅ Admin user password updated successfully!")
      } else {
        console.log("✅ Password already works correctly!")
      }
    }

    // Final verification
    console.log("🧪 Running final verification...")
    const finalUser = await sql`
      SELECT id, email, password_hash, name, role, is_active
      FROM admin_users 
      WHERE email = ${email}
    `

    if (finalUser.length > 0) {
      const finalTest = await bcrypt.compare(password, finalUser[0].password_hash)
      console.log("🎯 Final password verification:", finalTest ? "✅ SUCCESS" : "❌ FAILED")

      if (finalTest) {
        console.log("\n🎉 ADMIN LOGIN FIX COMPLETED SUCCESSFULLY!")
        console.log("🔑 Login credentials:")
        console.log("   Email:", email)
        console.log("   Password:", password)
        console.log("   Admin Panel: /admin")
        console.log("   Regular Login: /auth/login (will redirect admin users)")
      } else {
        console.log("❌ Final verification failed!")
      }
    }
  } catch (error) {
    console.error("❌ Error fixing admin password:", error)
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace")
  }
}

fixAdminPassword()
