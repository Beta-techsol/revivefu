import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  try {
    const debug = {
      cloudinaryConfig: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Missing",
        api_key: process.env.CLOUDINARY_API_KEY ? "Set" : "Missing",
        api_secret: process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing",
      },
      timestamp: new Date().toISOString(),
    }

    // Test cloudinary connection
    try {
      const result = await cloudinary.api.ping()
      debug.cloudinaryConnection = "Success"
      debug.cloudinaryPing = result
    } catch (error: any) {
      debug.cloudinaryConnection = "Failed"
      debug.cloudinaryError = error.message
    }

    return NextResponse.json({
      success: true,
      debug,
    })
  } catch (error: any) {
    console.error("Debug upload error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        debug: {
          timestamp: new Date().toISOString(),
          errorType: error.constructor.name,
        },
      },
      { status: 500 },
    )
  }
}
