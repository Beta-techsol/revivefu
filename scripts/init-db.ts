import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

async function initializeDatabase() {
  try {
    console.log("Initializing database...")

    // Create admin user if not exists
    const adminEmail = process.env.ADMIN_EMAIL || "admin@revivefurniture.com"
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123"

    const existingAdmin = await sql`
      SELECT id FROM admin_users WHERE email = ${adminEmail}
    `

    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12)

      await sql`
        INSERT INTO admin_users (email, password_hash, name, role)
        VALUES (${adminEmail}, ${hashedPassword}, 'Admin User', 'super_admin')
      `

      console.log(`Admin user created with email: ${adminEmail}`)
    }

    // Insert sample products for testing
    const sampleProducts = [
      {
        name: "Modern Sectional Sofa",
        slug: "modern-sectional-sofa",
        description:
          "A comfortable modern sectional sofa perfect for any living room. Features high-quality fabric upholstery and sturdy wooden frame construction.",
        short_description: "Comfortable modern sectional sofa with premium fabric upholstery",
        sku: "SOF-001",
        price: 1299.99,
        compare_price: 1599.99,
        cost: 800.0,
        stock_quantity: 15,
        material: "Fabric",
        color: "Charcoal Gray",
        brand: "Revive Furniture",
        status: "active",
        images: ["/shop/products/sofa-1.jpg", "/shop/products/sofa-2.jpg"],
        tags: ["sofa", "sectional", "modern", "living room"],
        is_featured: true,
        is_best_seller: true,
        room_type: "living_room",
        average_rating: 4.5,
        review_count: 128,
      },
      {
        name: "Executive Office Chair",
        slug: "executive-office-chair",
        description:
          "Ergonomic office chair with lumbar support and premium materials. Perfect for long working hours with adjustable height and tilt mechanism.",
        short_description: "Ergonomic office chair with lumbar support",
        sku: "CHR-001",
        price: 899.99,
        compare_price: 1199.99,
        cost: 500.0,
        stock_quantity: 25,
        material: "Leather",
        color: "Black",
        brand: "Revive Furniture",
        status: "active",
        images: ["/shop/products/chair-1.jpg"],
        tags: ["chair", "office", "ergonomic", "leather"],
        is_trending: true,
        is_hot_selling: true,
        room_type: "office",
        average_rating: 4.8,
        review_count: 89,
      },
      {
        name: "Modern Dining Set",
        slug: "modern-dining-set",
        description:
          "Contemporary 6-seater dining table with matching chairs in oak finish. Perfect for family gatherings and dinner parties.",
        short_description: "Contemporary 6-seater dining table with matching chairs",
        sku: "DIN-001",
        price: 1599.99,
        compare_price: 1999.99,
        cost: 1000.0,
        stock_quantity: 8,
        material: "Wood",
        color: "Oak",
        brand: "Revive Furniture",
        status: "active",
        images: ["/shop/products/dining-table-1.jpg"],
        tags: ["dining", "table", "chairs", "oak", "modern"],
        is_deal_of_day: true,
        is_latest: true,
        room_type: "dining_room",
        average_rating: 4.7,
        review_count: 73,
      },
      {
        name: "King Platform Bed",
        slug: "king-platform-bed",
        description:
          "Minimalist king size platform bed with integrated nightstands. Clean lines and modern design perfect for contemporary bedrooms.",
        short_description: "Minimalist king size platform bed with integrated nightstands",
        sku: "BED-001",
        price: 1299.99,
        compare_price: 1699.99,
        cost: 800.0,
        stock_quantity: 12,
        material: "Wood",
        color: "White",
        brand: "Revive Furniture",
        status: "active",
        images: ["/shop/products/bed-1.jpg"],
        tags: ["bed", "king", "platform", "modern", "bedroom"],
        is_featured: true,
        is_latest: true,
        room_type: "bedroom",
        average_rating: 4.6,
        review_count: 92,
      },
    ]

    // Get category IDs
    const categories = await sql`SELECT id, slug FROM categories`
    const categoryMap = categories.reduce((acc: any, cat: any) => {
      acc[cat.slug] = cat.id
      return acc
    }, {})

    // Insert sample products
    for (const product of sampleProducts) {
      const categoryId = categoryMap[product.room_type.replace("_", "-")] || null

      const existingProduct = await sql`
        SELECT id FROM products WHERE sku = ${product.sku}
      `

      if (existingProduct.length === 0) {
        await sql`
          INSERT INTO products (
            name, slug, description, short_description, sku, price, compare_price, cost,
            category_id, stock_quantity, material, color, brand, status, images, tags,
            is_featured, is_trending, is_best_seller, is_hot_selling, is_deal_of_day, is_latest,
            room_type, average_rating, review_count
          ) VALUES (
            ${product.name}, ${product.slug}, ${product.description}, ${product.short_description},
            ${product.sku}, ${product.price}, ${product.compare_price}, ${product.cost},
            ${categoryId}, ${product.stock_quantity}, ${product.material}, ${product.color},
            ${product.brand}, ${product.status}, ${JSON.stringify(product.images)}, ${JSON.stringify(product.tags)},
            ${product.is_featured}, ${product.is_trending}, ${product.is_best_seller}, 
            ${product.is_hot_selling}, ${product.is_deal_of_day}, ${product.is_latest},
            ${product.room_type}, ${product.average_rating}, ${product.review_count}
          )
        `
      }
    }

    console.log("Database initialized successfully!")
    console.log("Sample products created")
  } catch (error) {
    console.error("Database initialization error:", error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { initializeDatabase }
