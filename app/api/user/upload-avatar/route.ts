import { type NextRequest, NextResponse } from "next/server"
import { requireUserAuth } from "@/lib/user-auth"
import { sql } from "@/lib/db"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const POST = requireUserAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user
    const formData = await request.formData()
    const file = formData.get("avatar") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "user-avatars",
            public_id: `user-${user.id}`,
            transformation: [
              { width: 200, height: 200, crop: "fill", gravity: "face" },
              { quality: "auto", fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          },
        )
        .end(buffer)
    })

    const imageUrl = (uploadResponse as any).secure_url

    // Update user profile picture URL
    await sql`
      UPDATE users 
      SET profile_picture_url = ${imageUrl}
      WHERE id = ${user.id}
    `

    return NextResponse.json({
      success: true,
      message: "Profile picture updated successfully",
      profile_picture_url: imageUrl,
    })
  } catch (error) {
    console.error("Upload avatar error:", error)
    return NextResponse.json({ error: "Failed to upload avatar" }, { status: 500 })
  }
})
