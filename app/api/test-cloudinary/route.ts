import { uploadImage } from "@/lib/cloudinary"

export async function GET() {
  try {
    // Test Cloudinary configuration
    const testImageBase64 =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

    const result = await uploadImage(testImageBase64, "test")

    return Response.json({
      success: true,
      message: "Cloudinary connection successful",
      testUpload: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    })
  } catch (error: any) {
    console.error("Cloudinary test error:", error)
    return Response.json(
      {
        success: false,
        error: error.message,
        message: "Cloudinary connection failed",
      },
      { status: 500 },
    )
  }
}
