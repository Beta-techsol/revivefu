import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

async function fixAdminLogin() {
  try {
    const email = "admin@revivefurniture.com"
    const password = "betatech@p@$$"

    console.log("🔍 Checking current admin user...")

    // Check current admin user
    const currentUser = await sql`
      SELECT id, email, password_hash, 
             LENGTH(password_hash) as hash_length,
             SUBSTRING(password_hash, 1, 10) as hash_prefix
      FROM admin_users 
      WHERE email = ${email}
    `

    if (currentUser.length === 0) {
      console.log("❌ No admin user found with email:", email)
      return
    }

    console.log("Current admin user:")
    console.log("  ID:", currentUser[0].id)
    console.log("  Email:", currentUser[0].email)
    console.log("  Hash Length:", currentUser[0].hash_length)
    console.log("  Hash Prefix:", currentUser[0].hash_prefix)

    // Test current password
    const currentPasswordWorks = await bcrypt.compare(password, currentUser[0].password_hash)
    console.log("Current password works:", currentPasswordWorks)

    if (currentPasswordWorks) {
      console.log("✅ Password already works! No update needed.")
      return
    }

    // Generate new correct hash
    console.log("🔐 Generating new password hash...")
    const newPasswordHash = await bcrypt.hash(password, 12)
    console.log("New hash generated:", newPasswordHash.substring(0, 20) + "...")
    console.log("New hash length:", newPasswordHash.length)

    // Test the new hash before updating
    const newHashWorks = await bcrypt.compare(password, newPasswordHash)
    console.log("New hash verification test:", newHashWorks)

    if (!newHashWorks) {
      console.log("❌ New hash failed verification test!")
      return
    }

    // Update the admin user with correct password hash
    console.log("🔄 Updating admin user password...")
    await sql`
      UPDATE admin_users 
      SET password_hash = ${newPasswordHash}, updated_at = CURRENT_TIMESTAMP
      WHERE email = ${email}
    `

    // Verify the update
    const updatedUser = await sql`
      SELECT id, email, password_hash,
             LENGTH(password_hash) as hash_length,
             SUBSTRING(password_hash, 1, 10) as hash_prefix
      FROM admin_users 
      WHERE email = ${email}
    `

    console.log("✅ Admin user updated successfully!")
    console.log("Updated user:")
    console.log("  ID:", updatedUser[0].id)
    console.log("  Email:", updatedUser[0].email)
    console.log("  Hash Length:", updatedUser[0].hash_length)
    console.log("  Hash Prefix:", updatedUser[0].hash_prefix)

    // Final verification test
    const finalTest = await bcrypt.compare(password, updatedUser[0].password_hash)
    console.log("Final password verification:", finalTest ? "✅ SUCCESS" : "❌ FAILED")

    if (finalTest) {
      console.log("\n🎉 Admin login should now work!")
      console.log("Login credentials:")
      console.log("  Email:", email)
      console.log("  Password:", password)
      console.log("  Admin URL: /admin")
    }
  } catch (error) {
    console.error("❌ Error fixing admin login:", error)
  }
}

fixAdminLogin()
