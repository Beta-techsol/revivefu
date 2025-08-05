import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"
import fs from "fs"
import path from "path"

async function initializeDatabase() {
  try {
    console.log("🚀 Starting database initialization...")

    // Read and execute the SQL schema file
    const schemaPath = path.join(process.cwd(), "scripts", "create-tables.sql")
    const schemaSql = fs.readFileSync(schemaPath, "utf8")

    // Split SQL commands and execute them
    const commands = schemaSql
      .split(";")
      .map((cmd) => cmd.trim())
      .filter((cmd) => cmd.length > 0 && !cmd.startsWith("--"))

    console.log(`📝 Executing ${commands.length} SQL commands...`)

    for (const command of commands) {
      try {
        await sql.unsafe(command)
      } catch (error: any) {
        // Ignore some expected errors
        if (!error.message.includes("already exists") && !error.message.includes("does not exist")) {
          console.error(`❌ Error executing command: ${command.substring(0, 100)}...`)
          console.error(error.message)
        }
      }
    }

    console.log("✅ Database schema created successfully!")

    // Create admin user
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

      console.log(`👤 Admin user created: ${adminEmail}`)
    } else {
      console.log("👤 Admin user already exists")
    }

    // Insert sample products
    await insertSampleProducts()

    console.log("🎉 Database initialization completed successfully!")

    return {
      success: true,
      message: "Database initialized successfully",
      adminCredentials: {
        email: adminEmail,
        password: adminPassword,
      },
    }
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    throw error
  }
}

async function insertSampleProducts() {
  try {
    // Get category IDs
    const categories = await sql`SELECT id, slug FROM categories`
    const categoryMap = categories.reduce((acc: any, cat: any) => {
      acc[cat.slug] = cat.id
      return acc
    }, {})

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
        category_id: categoryMap["living-room"],
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
        category_id: categoryMap["office"],
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
        category_id: categoryMap["dining-room"],
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
        category_id: categoryMap["bedroom"],
      },
    ]

    for (const product of sampleProducts) {
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
            ${product.category_id}, ${product.stock_quantity}, ${product.material}, ${product.color},
            ${product.brand}, ${product.status}, ${JSON.stringify(product.images)}, ${JSON.stringify(product.tags)},
            ${product.is_featured || false}, ${product.is_trending || false}, ${product.is_best_seller || false}, 
            ${product.is_hot_selling || false}, ${product.is_deal_of_day || false}, ${product.is_latest || false},
            ${product.room_type}, 4.5, 50
          )
        `
      }
    }

    console.log("📦 Sample products inserted successfully!")
  } catch (error) {
    console.error("❌ Error inserting sample products:", error)
  }
}

// Export for API route
export { initializeDatabase }

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log("✅ Database initialization completed!")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Database initialization failed:", error)
      process.exit(1)
    })
}
