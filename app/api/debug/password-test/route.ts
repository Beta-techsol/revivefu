import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    console.log("[v0] Testing password hash for admin user")

    // Get the admin user from database
    const [user] = await sql`
      SELECT id, email, password_hash 
      FROM admin_users 
      WHERE email = 'admin@revivefurniture.com'
    `

    if (!user) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 })
    }

    // Test password with the stored hash
    const testPassword = "betatech@p@$$"
    const isValid = await bcrypt.compare(testPassword, user.password_hash)

    // Also create a fresh hash to compare
    const freshHash = await bcrypt.hash(testPassword, 12)
    const freshHashValid = await bcrypt.compare(testPassword, freshHash)

    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        storedHashLength: user.password_hash?.length || 0,
        storedHashPrefix: user.password_hash?.substring(0, 10) || "none",
        passwordTestResult: isValid,
        freshHashTest: freshHashValid,
        freshHashPrefix: freshHash.substring(0, 10),
      },
    })
  } catch (error) {
    console.error("[v0] Password test error:", error)
    return NextResponse.json(
      {
        error: "Password test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
