import { type NextRequest, NextResponse } from "next/server"
import { requireUserAuth } from "@/lib/user-auth"
import { sql } from "@/lib/db"

export const PUT = requireUserAuth(async (request: NextRequest, { params }: { params: { id: string } }) => {
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
        WHERE user_id = ${user.id} AND type = ${type} AND id != ${params.id}
      `
    }

    const [updatedAddress] = await sql`
      UPDATE user_addresses 
      SET type = ${type}, name = ${name}, address = ${address}, city = ${city}, 
          state = ${state}, zip = ${zip}, country = ${country}, phone = ${phone || null}, 
          is_default = ${is_default || false}
      WHERE id = ${params.id} AND user_id = ${user.id}
      RETURNING *
    `

    if (!updatedAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, address: updatedAddress })
  } catch (error) {
    console.error("Update address error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const DELETE = requireUserAuth(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const user = (request as any).user

    const [deletedAddress] = await sql`
      DELETE FROM user_addresses 
      WHERE id = ${params.id} AND user_id = ${user.id}
      RETURNING *
    `

    if (!deletedAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Address deleted successfully" })
  } catch (error) {
    console.error("Delete address error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
