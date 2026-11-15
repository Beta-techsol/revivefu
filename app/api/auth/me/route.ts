import { type NextRequest, NextResponse } from "next/server"
import { verifyJWT, findUserById } from "@/lib/user-auth"
import { verifyToken } from "@/lib/auth"

export const dynamic = "force-dynamic"
export const revalidate = 0

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401, headers: noStoreHeaders })
    }

    const adminUser = verifyToken(token)
    if (adminUser) {
      const fullName = (adminUser.name || "Admin User").trim()
      const nameParts = fullName.split(/\s+/)
      const firstName = nameParts[0] || "Admin"
      const lastName = nameParts.slice(1).join(" ") || ""

      return NextResponse.json(
        {
          id: adminUser.id,
          email: adminUser.email,
          name: fullName,
          role: adminUser.role,
          isAdmin: true,
          user: {
            id: String(adminUser.id),
            email: adminUser.email,
            firstName,
            lastName,
            name: fullName,
            role: adminUser.role,
            emailVerified: true,
            isAdmin: true,
          },
        },
        { headers: noStoreHeaders },
      )
    }

    const decoded = verifyJWT(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401, headers: noStoreHeaders })
    }

    const user = await findUserById(decoded.userId)
    if (!user || !user.email_verified || !user.is_active) {
      return NextResponse.json({ error: "User not found or inactive" }, { status: 401, headers: noStoreHeaders })
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          phone: user.phone,
          profilePicture: user.profile_picture_url,
          emailVerified: user.email_verified,
          lastLogin: user.last_login,
          isAdmin: false,
        },
      },
      { headers: noStoreHeaders },
    )
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Failed to get user" }, { status: 500, headers: noStoreHeaders })
  }
}
