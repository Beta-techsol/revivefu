import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

async function initializeDatabase() {
  try {
    console.log("🚀 Starting database initialization...")

    // First, let's check and add missing columns to existing tables
    try {
      // Add slug column to products if it doesn't exist
      await sql`
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE
      `

      // Add short_description column if it doesn't exist
      await sql`
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS short_description TEXT
      `

      // Add is_featured column if it doesn't exist
      await sql`
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false
      `

      // Add slug column to categories if it doesn't exist
      await sql`
        ALTER TABLE categories 
        ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE
      `

      console.log("✅ Database schema updated with missing columns")
    } catch (error) {
      console.log("ℹ️ Schema update skipped (columns may already exist)")
    }

    // Check if admin user already exists
    const existingAdmin = await sql`
      SELECT id FROM admin_users WHERE email = ${process.env.ADMIN_EMAIL || "admin@revivefurniture.com"}
    `

    if (existingAdmin.length > 0) {
      console.log("✅ Admin user already exists")

      // Update existing products with slugs if they don't have them
      const productsWithoutSlugs = await sql`
        SELECT id, name FROM products WHERE slug IS NULL OR slug = ''
      `

      for (const product of productsWithoutSlugs) {
        const slug = product.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
        await sql`
          UPDATE products 
          SET slug = ${slug}
          WHERE id = ${product.id}
        `
      }

      // Update existing categories with slugs if they don't have them
      const categoriesWithoutSlugs = await sql`
        SELECT id, name FROM categories WHERE slug IS NULL OR slug = ''
      `

      for (const category of categoriesWithoutSlugs) {
        const slug = category.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
        await sql`
          UPDATE categories 
          SET slug = ${slug}
          WHERE id = ${category.id}
        `
      }

      return {
        success: true,
        message: "Database already initialized, updated existing data",
        adminEmail: process.env.ADMIN_EMAIL || "admin@revivefurniture.com",
      }
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 12)

    // Create admin user
    const adminResult = await sql`
      INSERT INTO admin_users (email, password_hash, name, role)
      VALUES (
        ${process.env.ADMIN_EMAIL || "admin@revivefurniture.com"},
        ${hashedPassword},
        'Admin User',
        'admin'
      )
      RETURNING id, email
    `

    console.log("✅ Admin user created successfully!")
    console.log("📧 Email:", adminResult[0].email)
    console.log("🔑 Password:", process.env.ADMIN_PASSWORD || "admin123")

    // Update existing categories with slugs
    const categories = await sql`SELECT id, name FROM categories`
    for (const category of categories) {
      const slug = category.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      await sql`
        UPDATE categories 
        SET slug = ${slug}
        WHERE id = ${category.id}
      `
    }

    // Insert sample products for testing (only if no products exist)
    const existingProducts = await sql`SELECT COUNT(*) as count FROM products`

    if (existingProducts[0].count === 0) {
      const sampleProducts = [
        {
          name: "Modern Sectional Sofa",
          slug: "modern-sectional-sofa",
          description:
            "Comfortable and stylish sectional sofa perfect for modern living rooms. Features premium fabric upholstery and sturdy construction.",
          short_description: "Premium sectional sofa with contemporary design",
          sku: "SOF-001",
          price: 1299.99,
          stock_quantity: 15,
          category_id: 1, // Living Room
          images: ["/placeholder.svg?height=400&width=600&text=Modern+Sectional+Sofa"],
          is_featured: true,
        },
        {
          name: "Executive Office Chair",
          slug: "executive-office-chair",
          description:
            "Ergonomic executive chair with premium leather upholstery and adjustable features for maximum comfort during long work sessions.",
          short_description: "Professional office chair with lumbar support",
          sku: "CHR-001",
          price: 599.99,
          stock_quantity: 25,
          category_id: 4, // Office
          images: ["/placeholder.svg?height=400&width=600&text=Executive+Office+Chair"],
          is_featured: true,
        },
        {
          name: "Dining Table Set",
          slug: "dining-table-set",
          description:
            "Elegant 6-seater dining table with matching chairs. Crafted from solid wood with a beautiful finish.",
          short_description: "Complete dining set for family meals",
          sku: "DIN-001",
          price: 899.99,
          stock_quantity: 8,
          category_id: 3, // Dining Room
          images: ["/placeholder.svg?height=400&width=600&text=Dining+Table+Set"],
          is_featured: false,
        },
        {
          name: "King Size Bed Frame",
          slug: "king-size-bed-frame",
          description:
            "Sturdy king size bed frame with modern design. Features a padded headboard and solid construction.",
          short_description: "Modern king size bed with padded headboard",
          sku: "BED-001",
          price: 799.99,
          stock_quantity: 12,
          category_id: 2, // Bedroom
          images: ["/placeholder.svg?height=400&width=600&text=King+Size+Bed+Frame"],
          is_featured: true,
        },
      ]

      for (const product of sampleProducts) {
        await sql`
          INSERT INTO products (
            name, slug, description, short_description, sku, price, 
            stock_quantity, category_id, images, is_featured
          ) VALUES (
            ${product.name}, ${product.slug}, ${product.description}, 
            ${product.short_description}, ${product.sku}, ${product.price},
            ${product.stock_quantity}, ${product.category_id}, 
            ${product.images}, ${product.is_featured}
          )
        `
      }

      console.log("✅ Sample products created!")
    } else {
      // Update existing products with slugs and other missing data
      const products = await sql`SELECT id, name FROM products WHERE slug IS NULL OR slug = ''`
      for (const product of products) {
        const slug = product.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
        await sql`
          UPDATE products 
          SET slug = ${slug},
              short_description = COALESCE(short_description, SUBSTRING(description FROM 1 FOR 100)),
              is_featured = COALESCE(is_featured, false)
          WHERE id = ${product.id}
        `
      }
      console.log("✅ Updated existing products with missing data!")
    }

    // Create sample customer (only if none exist)
    const existingCustomers = await sql`SELECT COUNT(*) as count FROM customers`

    if (existingCustomers[0].count === 0) {
      await sql`
        INSERT INTO customers (name, email, phone, status)
        VALUES (
          'John Doe',
          'customer@example.com',
          '+1-555-0123',
          'active'
        )
      `
      console.log("✅ Sample customer created!")
    }

    // Create sample order (only if none exist)
    const existingOrders = await sql`SELECT COUNT(*) as count FROM orders`

    if (existingOrders[0].count === 0) {
      const orderNumber = `ORD-${Date.now()}`
      const orderResult = await sql`
        INSERT INTO orders (
          order_number, customer_id, status, subtotal, total, 
          shipping_address, billing_address, customer_name, customer_email
        ) VALUES (
          ${orderNumber},
          1,
          'processing',
          1299.99,
          1299.99,
          '{"first_name": "John", "last_name": "Doe", "address_line_1": "123 Main St", "city": "New York", "state": "NY", "postal_code": "10001", "country": "USA"}',
          '{"first_name": "John", "last_name": "Doe", "address_line_1": "123 Main St", "city": "New York", "state": "NY", "postal_code": "10001", "country": "USA"}',
          'John Doe',
          'customer@example.com'
        )
        RETURNING id
      `

      // Add order item
      await sql`
        INSERT INTO order_items (
          order_id, product_id, product_name, product_sku, 
          quantity, price, total
        ) VALUES (
          ${orderResult[0].id},
          1,
          'Modern Sectional Sofa',
          'SOF-001',
          1,
          1299.99,
          1299.99
        )
      `

      console.log("✅ Sample order created!")
    }

    // Create sample blog post (only if none exist)
    const existingPosts = await sql`SELECT COUNT(*) as count FROM blog_posts`

    if (existingPosts[0].count === 0) {
      await sql`
        INSERT INTO blog_posts (
          title, slug, content, excerpt, author, status, published_at
        ) VALUES (
          'Welcome to Revive Furniture',
          'welcome-to-revive-furniture',
          'Welcome to our new furniture store! We specialize in modern, comfortable, and stylish furniture for every room in your home. Our collection features carefully selected pieces that combine functionality with aesthetic appeal.',
          'Discover our collection of premium furniture designed for modern living.',
          'Admin User',
          'published',
          CURRENT_TIMESTAMP
        )
      `
      console.log("✅ Sample blog post created!")
    }

    console.log("🎉 Database initialization completed successfully!")
    console.log("")
    console.log("🔐 Admin Login Details:")
    console.log("📧 Email:", process.env.ADMIN_EMAIL || "admin@revivefurniture.com")
    console.log("🔑 Password:", process.env.ADMIN_PASSWORD || "admin123")
    console.log("")
    console.log("🌐 Access your admin panel at: /admin")

    return {
      success: true,
      message: "Database initialized successfully",
      adminEmail: process.env.ADMIN_EMAIL || "admin@revivefurniture.com",
    }
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    return {
      success: false,
      error: `Database initialization failed: ${error.message}`,
      timestamp: new Date().toISOString(),
    }
  }
}

// Export for use in API routes
export { initializeDatabase }
