import { type NextRequest, NextResponse } from "next/server"
import { verifyJWT, findUserById } from "@/lib/user-auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const decoded = verifyJWT(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const user = await findUserById(decoded.userId)
    if (!user || !user.is_verified) {
      return NextResponse.json({ error: "User not found or not verified" }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        isVerified: user.is_verified,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 })
  }
}
