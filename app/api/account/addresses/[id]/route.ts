import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyJWT } from "@/lib/user-auth"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
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

    // Handle default addresses from orders (read-only)
    if (params.id.includes("default")) {
      // Create new address instead of updating default
      if (isDefault) {
        await sql`
          UPDATE user_default_addresses 
          SET is_default = false 
          WHERE user_id = ${decoded.userId} AND address_type = ${addressType}
        `
      }

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
        WHERE user_id = ${decoded.userId} AND address_type = ${addressType} AND id != ${params.id}
      `
    }

    // Update address
    const result = await sql`
      UPDATE user_default_addresses SET
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
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id} AND user_id = ${decoded.userId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    return NextResponse.json({ address: result[0] })
  } catch (error) {
    console.error("Error updating address:", error)
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
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

    // Don't allow deleting default addresses from orders
    if (params.id.includes("default")) {
      return NextResponse.json({ error: "Cannot delete default address from orders" }, { status: 400 })
    }

    // Delete address
    const result = await sql`
      DELETE FROM user_default_addresses 
      WHERE id = ${params.id} AND user_id = ${decoded.userId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Address deleted successfully" })
  } catch (error) {
    console.error("Error deleting address:", error)
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 })
  }
}
