import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const [user] = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    return NextResponse.json({ exists: !!user })
  } catch (error) {
    console.error("Check email error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
