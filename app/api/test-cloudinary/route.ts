import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

export async function GET() {
  try {
    // Check environment variables
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({
        success: false,
        error: "Cloudinary environment variables are not properly configured",
        missing_vars: {
          CLOUDINARY_CLOUD_NAME: !cloudName,
          CLOUDINARY_API_KEY: !apiKey,
          CLOUDINARY_API_SECRET: !apiSecret,
        },
        timestamp: new Date().toISOString(),
      })
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    })

    // Test connection by getting account details
    const result = await cloudinary.api.ping()

    // Get usage stats
    const usage = await cloudinary.api.usage()

    return NextResponse.json({
      success: true,
      message: "Cloudinary connection successful",
      config: {
        cloud_name: cloudName,
        api_key: apiKey.substring(0, 6) + "***", // Partially hide for security
      },
      ping_result: result,
      usage: {
        plan: usage.plan,
        credits: usage.credits,
        used_percent: usage.used_percent,
        limit: usage.limit,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Cloudinary test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown Cloudinary error",
        config_status: {
          CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
          CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
          CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
