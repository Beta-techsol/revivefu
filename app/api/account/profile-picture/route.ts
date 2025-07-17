import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyJWT } from "@/lib/user-auth"
import { v2 as cloudinary } from "cloudinary"

const sql = neon(process.env.DATABASE_URL!)

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/account/profile-picture - Starting")

    // Get JWT token from cookies
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify token
    const decoded = verifyJWT(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "profile-pictures",
            public_id: `user-${decoded.userId}-${Date.now()}`,
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

    const result = uploadResult as any

    // Update user profile picture URL in database
    const updateResult = await sql`
      UPDATE users 
      SET profile_picture_url = ${result.secure_url},
          updated_at = NOW()
      WHERE id = ${decoded.userId}
      RETURNING id, email, first_name, last_name, phone, profile_picture_url, 
               email_verified, is_active, last_login, created_at
    `

    if (updateResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: updateResult[0],
      message: "Profile picture updated successfully",
    })
  } catch (error) {
    console.error("Error uploading profile picture:", error)
    return NextResponse.json(
      {
        error: "Failed to upload profile picture",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log("DELETE /api/account/profile-picture - Starting")

    // Get JWT token from cookies
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify token
    const decoded = verifyJWT(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get current profile picture URL
    const userResult = await sql`
      SELECT profile_picture_url FROM users WHERE id = ${decoded.userId}
    `

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const currentProfilePicture = userResult[0].profile_picture_url

    // Delete from Cloudinary if exists
    if (currentProfilePicture && currentProfilePicture.includes("cloudinary.com")) {
      try {
        const publicId = currentProfilePicture.split("/").pop()?.split(".")[0]
        if (publicId) {
          await cloudinary.uploader.destroy(`profile-pictures/${publicId}`)
        }
      } catch (error) {
        console.error("Error deleting from Cloudinary:", error)
        // Continue even if Cloudinary deletion fails
      }
    }

    // Remove profile picture URL from database
    const updateResult = await sql`
      UPDATE users 
      SET profile_picture_url = NULL,
          updated_at = NOW()
      WHERE id = ${decoded.userId}
      RETURNING id, email, first_name, last_name, phone, profile_picture_url, 
               email_verified, is_active, last_login, created_at
    `

    return NextResponse.json({
      user: updateResult[0],
      message: "Profile picture removed successfully",
    })
  } catch (error) {
    console.error("Error removing profile picture:", error)
    return NextResponse.json(
      {
        error: "Failed to remove profile picture",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
