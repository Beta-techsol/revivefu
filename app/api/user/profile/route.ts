import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, updateUserProfile, changePassword } from "@/lib/user-auth"
import { z } from "zod"

const updateProfileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
  profilePictureUrl: z.string().url().optional().or(z.literal("")),
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
})

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()

    if (body.currentPassword && body.newPassword) {
      // Handle password change
      const { currentPassword, newPassword } = changePasswordSchema.parse(body)

      const success = await changePassword(decoded.id, currentPassword, newPassword)
      if (!success) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
      }

      return NextResponse.json({ message: "Password updated successfully" })
    } else {
      // Handle profile update
      const updates = updateProfileSchema.parse(body)

      const user = await updateUserProfile(decoded.id, updates)
      if (!user) {
        return NextResponse.json({ error: "Failed to update profile" }, { status: 400 })
      }

      return NextResponse.json({ user, message: "Profile updated successfully" })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }

    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
