import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const response = Response.json({ message: "Logged out successfully" })

    // Clear the HTTP-only cookie
    response.headers.set("Set-Cookie", "admin-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict")

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return Response.json({ error: "Logout failed" }, { status: 500 })
  }
}
