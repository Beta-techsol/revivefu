import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  const results = {
    database: { connected: false, error: null as string | null },
    cloudinary: { connected: false, error: null as string | null },
    environment: {
      DATABASE_URL: !!process.env.DATABASE_URL,
      CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
      JWT_SECRET: !!process.env.JWT_SECRET,
      ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
      ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
    },
  }

  // Test Database Connection
  try {
    const dbResult = await sql`SELECT 1 as test, NOW() as timestamp`
    results.database.connected = true
    console.log("Database test successful:", dbResult[0])
  } catch (error) {
    results.database.connected = false
    results.database.error = error instanceof Error ? error.message : "Unknown database error"
    console.error("Database test failed:", error)
  }

  // Test Cloudinary Connection
  try {
    const cloudinaryResult = await cloudinary.api.ping()
    results.cloudinary.connected = cloudinaryResult.status === "ok"
    console.log("Cloudinary test successful:", cloudinaryResult)
  } catch (error) {
    results.cloudinary.connected = false
    results.cloudinary.error = error instanceof Error ? error.message : "Unknown Cloudinary error"
    console.error("Cloudinary test failed:", error)
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    connections: results,
  })
}
