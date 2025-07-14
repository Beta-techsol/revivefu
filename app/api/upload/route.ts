import { uploadImage, deleteImage } from "@/lib/cloudinary"
import { requireAuth } from "@/lib/auth"

export const POST = requireAuth(async (request: Request) => {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "products"

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return Response.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ error: "File size must be less than 10MB" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert buffer to base64 data URL
    const base64 = buffer.toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    const result = await uploadImage(dataUrl, folder)

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

export const DELETE = requireAuth(async (request: Request) => {
  try {
    const { public_id } = await request.json()

    if (!public_id) {
      return Response.json({ error: "Public ID is required" }, { status: 400 })
    }

    await deleteImage(public_id)

    return Response.json({ message: "Image deleted successfully" })
  } catch (error) {
    console.error("Delete error:", error)
    return Response.json({ error: "Failed to delete image" }, { status: 500 })
  }
})
