import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyJWT } from "@/lib/user-auth"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/account/addresses - Starting")

    // Get JWT token from cookies
    const token = request.cookies.get("auth-token")?.value
    console.log("Token found:", !!token)

    if (!token) {
      console.log("No token provided")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify token
    const decoded = verifyJWT(token)
    console.log("Token decoded:", !!decoded)

    if (!decoded) {
      console.log("Invalid token")
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    console.log("User ID:", decoded.userId, "Email:", decoded.email)

    // Get user's default addresses
    const addresses = await sql`
      SELECT * FROM user_default_addresses 
      WHERE user_id = ${decoded.userId}
      ORDER BY address_type, is_default DESC, created_at DESC
    `

    console.log("Found saved addresses:", addresses.length)

    // If no default addresses exist, get from most recent order
    if (addresses.length === 0) {
      console.log("No saved addresses, checking recent orders")

      const recentOrder = await sql`
        SELECT 
          customer_name,
          customer_company,
          customer_address,
          customer_address_line_2,
          customer_city,
          customer_state,
          customer_zip,
          customer_country,
          customer_phone,
          customer_landmark,
          billing_name,
          billing_company,
          billing_address,
          billing_address_line_2,
          billing_city,
          billing_state,
          billing_zip,
          billing_country,
          billing_phone,
          billing_landmark
        FROM orders 
        WHERE customer_email = ${decoded.email}
        ORDER BY created_at DESC 
        LIMIT 1
      `

      console.log("Recent orders found:", recentOrder.length)

      const defaultAddresses = []

      if (recentOrder.length > 0) {
        const order = recentOrder[0]
        console.log("Order data:", order)

        // Add shipping address if exists
        if (order.customer_address) {
          defaultAddresses.push({
            id: "shipping-default",
            address_type: "shipping",
            customer_name: order.customer_name || "Customer",
            customer_company: order.customer_company,
            customer_address: order.customer_address,
            customer_address_line_2: order.customer_address_line_2,
            customer_city: order.customer_city,
            customer_state: order.customer_state,
            customer_zip: order.customer_zip,
            customer_country: order.customer_country || "Pakistan",
            customer_phone: order.customer_phone,
            customer_landmark: order.customer_landmark,
            is_default: true,
            created_at: new Date().toISOString(),
          })
        }

        // Add billing address if exists and different from shipping
        if (order.billing_address && order.billing_address !== order.customer_address) {
          defaultAddresses.push({
            id: "billing-default",
            address_type: "billing",
            customer_name: order.billing_name || order.customer_name || "Customer",
            customer_company: order.billing_company,
            customer_address: order.billing_address,
            customer_address_line_2: order.billing_address_line_2,
            customer_city: order.billing_city,
            customer_state: order.billing_state,
            customer_zip: order.billing_zip,
            customer_country: order.billing_country || "Pakistan",
            customer_phone: order.billing_phone,
            customer_landmark: order.billing_landmark,
            is_default: true,
            created_at: new Date().toISOString(),
          })
        }
      }

      console.log("Returning default addresses:", defaultAddresses.length)
      return NextResponse.json({ addresses: defaultAddresses })
    }

    console.log("Returning saved addresses:", addresses.length)
    return NextResponse.json({ addresses })
  } catch (error) {
    console.error("Error fetching addresses:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch addresses",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/account/addresses - Starting")

    // Get JWT token from cookies
    const token = request.cookies.get("auth-token")?.value
    console.log("Token found:", !!token)

    if (!token) {
      console.log("No token provided")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify token
    const decoded = verifyJWT(token)
    console.log("Token decoded:", !!decoded)

    if (!decoded) {
      console.log("Invalid token")
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Request body:", body)

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
      console.log("Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("Validation passed")

    // If setting as default, unset other default addresses of same type
    if (isDefault) {
      console.log("Unsetting other default addresses for type:", addressType)
      await sql`
        UPDATE user_default_addresses 
        SET is_default = false 
        WHERE user_id = ${decoded.userId} AND address_type = ${addressType}
      `
    }

    // Insert new address
    console.log("Inserting new address")
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

    console.log("Address created successfully:", result[0])
    return NextResponse.json({ address: result[0] })
  } catch (error) {
    console.error("Error creating address:", error)
    return NextResponse.json(
      {
        error: "Failed to create address",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
