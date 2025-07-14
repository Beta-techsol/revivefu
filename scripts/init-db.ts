import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

async function initializeDatabase() {
  try {
    console.log("🚀 Starting database initialization...")

    // Check if admin user already exists
    const existingAdmin = await sql`
      SELECT id FROM admin_users WHERE email = ${process.env.ADMIN_EMAIL || "admin@revivefurniture.com"}
    `

    if (existingAdmin.length > 0) {
      console.log("✅ Admin user already exists, skipping creation")
      return { success: true, message: "Database already initialized" }
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

    // Insert sample products for testing
    const sampleProducts = [
      {
        name: "Modern Sectional Sofa",
        slug: "modern-sectional-sofa",
        description: "Comfortable and stylish sectional sofa perfect for modern living rooms",
        short_description: "Premium sectional sofa with contemporary design",
        sku: "SOF-001",
        price: 1299.99,
        stock_quantity: 15,
        category_id: 1, // Living Room
        featured_image: "/placeholder.svg?height=400&width=600&text=Modern+Sectional+Sofa",
        is_featured: true,
      },
      {
        name: "Executive Office Chair",
        slug: "executive-office-chair",
        description: "Ergonomic executive chair with premium leather upholstery",
        short_description: "Professional office chair with lumbar support",
        sku: "CHR-001",
        price: 599.99,
        stock_quantity: 25,
        category_id: 4, // Office
        featured_image: "/placeholder.svg?height=400&width=600&text=Executive+Office+Chair",
        is_featured: true,
      },
      {
        name: "Dining Table Set",
        slug: "dining-table-set",
        description: "Elegant 6-seater dining table with matching chairs",
        short_description: "Complete dining set for family meals",
        sku: "DIN-001",
        price: 899.99,
        stock_quantity: 8,
        category_id: 3, // Dining Room
        featured_image: "/placeholder.svg?height=400&width=600&text=Dining+Table+Set",
        is_featured: false,
      },
    ]

    for (const product of sampleProducts) {
      await sql`
        INSERT INTO products (
          name, slug, description, short_description, sku, price, 
          stock_quantity, category_id, featured_image, is_featured
        ) VALUES (
          ${product.name}, ${product.slug}, ${product.description}, 
          ${product.short_description}, ${product.sku}, ${product.price},
          ${product.stock_quantity}, ${product.category_id}, 
          ${product.featured_image}, ${product.is_featured}
        )
        ON CONFLICT (slug) DO NOTHING
      `
    }

    console.log("✅ Sample products created!")

    // Create sample customer
    const customerPassword = await bcrypt.hash("customer123", 12)
    await sql`
      INSERT INTO customers (email, password_hash, first_name, last_name, phone)
      VALUES (
        'customer@example.com',
        ${customerPassword},
        'John',
        'Doe',
        '+1-555-0123'
      )
      ON CONFLICT (email) DO NOTHING
    `

    console.log("✅ Sample customer created!")

    // Create sample order
    const orderNumber = `ORD-${Date.now()}`
    const orderResult = await sql`
      INSERT INTO orders (
        order_number, customer_id, status, payment_status, 
        subtotal, total_amount, shipping_address, billing_address
      ) VALUES (
        ${orderNumber},
        1,
        'processing',
        'paid',
        1299.99,
        1299.99,
        '{"first_name": "John", "last_name": "Doe", "address_line_1": "123 Main St", "city": "New York", "state": "NY", "postal_code": "10001", "country": "USA"}',
        '{"first_name": "John", "last_name": "Doe", "address_line_1": "123 Main St", "city": "New York", "state": "NY", "postal_code": "10001", "country": "USA"}'
      )
      RETURNING id
    `

    // Add order item
    await sql`
      INSERT INTO order_items (
        order_id, product_id, product_name, product_sku, 
        quantity, unit_price, total_price
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

    // Create sample blog post
    await sql`
      INSERT INTO blog_posts (
        title, slug, content, excerpt, author_id, status, published_at
      ) VALUES (
        'Welcome to Revive Furniture',
        'welcome-to-revive-furniture',
        'Welcome to our new furniture store! We specialize in modern, comfortable, and stylish furniture for every room in your home.',
        'Discover our collection of premium furniture designed for modern living.',
        ${adminResult[0].id},
        'published',
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (slug) DO NOTHING
    `

    console.log("✅ Sample blog post created!")

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
    throw new Error(`Database initialization failed: ${error.message}`)
  }
}

// Export for use in API routes
export { initializeDatabase }

// Auto-run if executed directly
if (typeof window === "undefined" && require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log("✅ Initialization complete!")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Initialization failed:", error)
      process.exit(1)
    })
}
