import { type NextRequest, NextResponse } from "next/server"
import { verifyEmail } from "@/lib/user-auth"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 })
    }

    const success = await verifyEmail(token)

    if (!success) {
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now log in.",
    })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Email verification failed" }, { status: 500 })
  }
}
