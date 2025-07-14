import type { NextRequest } from "next/server"
import { uploadImage } from "@/lib/cloudinary"
import { requireAuth } from "@/lib/auth"

export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "revive-furniture"

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to base64 for Cloudinary
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`

    const result = await uploadImage(base64, folder)

    return Response.json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return Response.json({ error: "Failed to upload image" }, { status: 500 })
  }
})
