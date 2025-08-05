import { type NextRequest, NextResponse } from "next/server"
import { verifyEmailToken } from "@/lib/user-auth"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    const isVerified = await verifyEmailToken(token)

    if (!isVerified) {
      return NextResponse.json(
        {
          error: "Invalid or expired verification token",
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      message: "Email verified successfully. You can now log in.",
    })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Email verification failed" }, { status: 500 })
  }
}
