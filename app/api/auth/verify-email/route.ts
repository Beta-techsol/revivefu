import { type NextRequest, NextResponse } from "next/server"
import { verifyEmailToken } from "@/lib/user-auth"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 })
    }

    const success = await verifyEmailToken(token)

    if (!success) {
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 })
    }

    return NextResponse.json({ message: "Email verified successfully" })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Email verification failed" }, { status: 500 })
  }
}
