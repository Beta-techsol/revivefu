import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const response = Response.json({ message: "Logged out successfully" })

  // Clear the cookie
  response.headers.set("Set-Cookie", "admin-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict")

  return response
}
