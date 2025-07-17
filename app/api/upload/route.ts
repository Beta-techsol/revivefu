import { type NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    console.log("Upload API called")

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.log("No file provided")
      return NextResponse.json(
        {
          success: false,
          error: "No file provided",
        },
        { status: 400 },
      )
    }

    console.log("File details:", {
      name: file.name,
      size: file.size,
      type: file.type,
    })

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    console.log("Buffer created, size:", buffer.length)

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            folder: "revive-furniture/blog",
            transformation: [{ width: 1200, height: 800, crop: "limit" }, { quality: "auto" }, { format: "auto" }],
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary error:", error)
              reject(error)
            } else {
              console.log("Cloudinary success:", result?.secure_url)
              resolve(result)
            }
          },
        )
        .end(buffer)
    })

    const uploadResult = result as any

    const response = {
      success: true,
      data: {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      },
      // Also include direct properties for backward compatibility
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    }

    console.log("Sending response:", response)

    return NextResponse.json(response)
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Upload failed",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { public_id } = body

    if (!public_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Public ID is required",
        },
        { status: 400 },
      )
    }

    await cloudinary.uploader.destroy(public_id)

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    })
  } catch (error: any) {
    console.error("Delete error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Delete failed",
      },
      { status: 500 },
    )
  }
}
