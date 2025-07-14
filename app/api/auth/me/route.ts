import type { NextRequest } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    return Response.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return Response.json({ error: "Authentication failed" }, { status: 500 })
  }
}
