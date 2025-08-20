import { neon } from "@neondatabase/serverless"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const sql = neon(process.env.DATABASE_URL)

async function uploadImageToCloudinary(imageUrl, productId, imageIndex) {
  try {
    console.log(`[v0] Uploading image: ${imageUrl}`)

    // Upload to Cloudinary with a structured public_id
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: "products",
      public_id: `product_${productId}_${imageIndex}`,
      overwrite: true,
      resource_type: "auto",
    })

    console.log(`[v0] Successfully uploaded to Cloudinary: ${result.secure_url}`)
    return result.secure_url
  } catch (error) {
    console.error(`[v0] Failed to upload ${imageUrl}:`, error.message)
    return null
  }
}

async function migrateProductImages() {
  try {
    console.log("[v0] Starting image migration to Cloudinary...")

    // Get all products with old domain images
    const products = await sql`
      SELECT id, name, images 
      FROM products 
      WHERE images::text LIKE '%revivefurniture.pk%'
    `

    console.log(`[v0] Found ${products.length} products with old domain images`)

    let totalMigrated = 0
    let totalFailed = 0

    for (const product of products) {
      console.log(`[v0] Processing product: ${product.name} (ID: ${product.id})`)

      const images = product.images || []
      const newImages = []

      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i]

        if (imageUrl.includes("revivefurniture.pk")) {
          console.log(`[v0] Migrating image ${i + 1}/${images.length}: ${imageUrl}`)

          const cloudinaryUrl = await uploadImageToCloudinary(imageUrl, product.id, i)

          if (cloudinaryUrl) {
            newImages.push(cloudinaryUrl)
            totalMigrated++
          } else {
            // Keep original URL if upload failed
            newImages.push(imageUrl)
            totalFailed++
          }
        } else {
          // Keep non-old-domain images as is
          newImages.push(imageUrl)
        }
      }

      // Update product with new image URLs
      await sql`
        UPDATE products 
        SET images = ${JSON.stringify(newImages)}
        WHERE id = ${product.id}
      `

      console.log(`[v0] Updated product ${product.id} with ${newImages.length} images`)
    }

    console.log(`[v0] Migration complete!`)
    console.log(`[v0] Total images migrated: ${totalMigrated}`)
    console.log(`[v0] Total images failed: ${totalFailed}`)
  } catch (error) {
    console.error("[v0] Migration failed:", error)
  }
}

// Run the migration
migrateProductImages()
