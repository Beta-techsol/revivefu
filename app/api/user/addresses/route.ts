import { type NextRequest, NextResponse } from "next/server"
import { requireUserAuth } from "@/lib/user-auth"
import { sql } from "@/lib/db"

export const GET = requireUserAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user

    const addresses = await sql`
      SELECT * FROM user_addresses 
      WHERE user_id = ${user.id}
      ORDER BY type, is_default DESC, created_at DESC
    `

    return NextResponse.json({ success: true, addresses })
  } catch (error) {
    console.error("Get addresses error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const POST = requireUserAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user
    const { type, name, address, city, state, zip, country, phone, is_default } = await request.json()

    if (!type || !name || !address || !city || !state || !zip || !country) {
      return NextResponse.json({ error: "All address fields are required" }, { status: 400 })
    }

    // If this is set as default, unset other defaults of the same type
    if (is_default) {
      await sql`
        UPDATE user_addresses 
        SET is_default = false 
        WHERE user_id = ${user.id} AND type = ${type}
      `
    }

    const [newAddress] = await sql`
      INSERT INTO user_addresses (user_id, type, name, address, city, state, zip, country, phone, is_default)
      VALUES (${user.id}, ${type}, ${name}, ${address}, ${city}, ${state}, ${zip}, ${country}, ${phone || null}, ${is_default || false})
      RETURNING *
    `

    return NextResponse.json({ success: true, address: newAddress })
  } catch (error) {
    console.error("Create address error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
