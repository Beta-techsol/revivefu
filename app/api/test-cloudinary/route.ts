import { uploadImage } from "@/lib/cloudinary"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert buffer to base64 data URL
    const base64 = buffer.toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    const result = await uploadImage(dataUrl, "test-uploads")

    return Response.json({
      status: "success",
      message: "Image uploaded successfully",
      data: result,
    })
  } catch (error) {
    console.error("Cloudinary test error:", error)
    return Response.json(
      {
        status: "error",
        message: "Image upload failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return Response.json({
    status: "info",
    message: "Cloudinary test endpoint - use POST with file upload",
    config: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "configured" : "missing",
      api_key: process.env.CLOUDINARY_API_KEY ? "configured" : "missing",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "configured" : "missing",
    },
  })
}
