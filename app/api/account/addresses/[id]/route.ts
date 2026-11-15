import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyJWT } from "@/lib/user-auth"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("PUT /api/account/addresses/[id] - Starting")

    // Get JWT token from cookies
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify token
    const decoded = verifyJWT(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()

    const {
      addressType,
      isDefault,
      customerName,
      customerCompany,
      customerAddress,
      customerAddressLine2,
      customerCity,
      customerState,
      customerZip,
      customerCountry,
      customerPhone,
      customerLandmark,
    } = body

    // Validate required fields
    if (!addressType || !customerName || !customerAddress || !customerCity || !customerZip) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // If this is a default address from order, create new instead of update
    if (id.includes("default")) {
      console.log("Creating new address from order default")

      // If setting as default, unset other default addresses of same type
      if (isDefault) {
        await sql`
          UPDATE user_default_addresses 
          SET is_default = false 
          WHERE user_id = ${decoded.userId} AND address_type = ${addressType}
        `
      }

      // Insert new address
      const result = await sql`
        INSERT INTO user_default_addresses (
          user_id, address_type, is_default, customer_name, customer_company,
          customer_address, customer_address_line_2, customer_city, customer_state, 
          customer_zip, customer_country, customer_phone, customer_landmark
        ) VALUES (
          ${decoded.userId}, ${addressType}, ${isDefault || false}, ${customerName}, ${customerCompany || null},
          ${customerAddress}, ${customerAddressLine2 || null}, ${customerCity}, ${customerState || null}, 
          ${customerZip}, ${customerCountry || "Pakistan"}, ${customerPhone || null}, ${customerLandmark || null}
        )
        RETURNING *
      `

      return NextResponse.json({ address: result[0] })
    }

    // If setting as default, unset other default addresses of same type
    if (isDefault) {
      await sql`
        UPDATE user_default_addresses 
        SET is_default = false 
        WHERE user_id = ${decoded.userId} AND address_type = ${addressType} AND id != ${id}
      `
    }

    // Update existing address
    const result = await sql`
      UPDATE user_default_addresses 
      SET 
        address_type = ${addressType},
        is_default = ${isDefault || false},
        customer_name = ${customerName},
        customer_company = ${customerCompany || null},
        customer_address = ${customerAddress},
        customer_address_line_2 = ${customerAddressLine2 || null},
        customer_city = ${customerCity},
        customer_state = ${customerState || null},
        customer_zip = ${customerZip},
        customer_country = ${customerCountry || "Pakistan"},
        customer_phone = ${customerPhone || null},
        customer_landmark = ${customerLandmark || null},
        updated_at = NOW()
      WHERE id = ${id} AND user_id = ${decoded.userId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    return NextResponse.json({ address: result[0] })
  } catch (error) {
    console.error("Error updating address:", error)
    return NextResponse.json(
      {
        error: "Failed to update address",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("DELETE /api/account/addresses/[id] - Starting")

    // Get JWT token from cookies
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify token
    const decoded = verifyJWT(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { id } = params

    // Cannot delete default addresses from orders
    if (id.includes("default")) {
      return NextResponse.json({ error: "Cannot delete address from orders" }, { status: 400 })
    }

    // Delete address
    const result = await sql`
      DELETE FROM user_default_addresses 
      WHERE id = ${id} AND user_id = ${decoded.userId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Address deleted successfully" })
  } catch (error) {
    console.error("Error deleting address:", error)
    return NextResponse.json(
      {
        error: "Failed to delete address",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
