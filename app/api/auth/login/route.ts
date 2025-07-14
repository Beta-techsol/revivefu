import type { NextRequest } from "next/server"
import { executeQuerySingle } from "@/lib/db"
import { verifyPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find admin user
    const user = await executeQuerySingle("SELECT * FROM admin_users WHERE email = $1", [email])

    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Update last login
    await executeQuerySingle("UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1", [user.id])

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })

    const response = Response.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    })

    // Set HTTP-only cookie
    response.headers.set("Set-Cookie", `admin-token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`)

    return response
  } catch (error) {
    console.error("Login error:", error)
    return Response.json({ error: "Login failed" }, { status: 500 })
  }
}
