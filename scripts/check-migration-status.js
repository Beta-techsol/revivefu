import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

async function checkMigrationStatus() {
  try {
    console.log("[v0] Checking migration status...")

    // Count products with old domain images
    const oldDomainProducts = await sql`
      SELECT COUNT(*) as count
      FROM products 
      WHERE images::text LIKE '%revivefurniture.pk%'
    `

    // Count products with Cloudinary images
    const cloudinaryProducts = await sql`
      SELECT COUNT(*) as count
      FROM products 
      WHERE images::text LIKE '%cloudinary.com%'
    `

    // Get total products
    const totalProducts = await sql`
      SELECT COUNT(*) as count FROM products
    `

    console.log(`[v0] Migration Status Report:`)
    console.log(`[v0] Total products: ${totalProducts[0].count}`)
    console.log(`[v0] Products with old domain images: ${oldDomainProducts[0].count}`)
    console.log(`[v0] Products with Cloudinary images: ${cloudinaryProducts[0].count}`)

    if (oldDomainProducts[0].count > 0) {
      console.log(`[v0] ⚠️  ${oldDomainProducts[0].count} products still need migration`)

      // Show examples of products that need migration
      const examples = await sql`
        SELECT id, name, images 
        FROM products 
        WHERE images::text LIKE '%revivefurniture.pk%'
        LIMIT 5
      `

      console.log(`[v0] Examples of products needing migration:`)
      examples.forEach((product) => {
        console.log(`[v0] - ${product.name} (ID: ${product.id})`)
        const oldImages = product.images.filter((img) => img.includes("revivefurniture.pk"))
        console.log(`[v0]   Old images: ${oldImages.length}`)
      })
    } else {
      console.log(`[v0] ✅ All products have been migrated!`)
    }
  } catch (error) {
    console.error("[v0] Status check failed:", error)
  }
}

checkMigrationStatus()
