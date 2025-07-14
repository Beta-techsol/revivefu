import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    console.log("Starting database initialization...")

    // Create missing columns if they don't exist
    try {
      await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS slug VARCHAR(255)`
      await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT`
      await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id INTEGER`
      await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0`
      await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false`
      await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active'`
      await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
      await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
    } catch (error) {
      console.log("Products table columns already exist or error:", error.message)
    }

    // Create categories table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        parent_id INTEGER REFERENCES categories(id),
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create orders table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(100) UNIQUE NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50),
        shipping_address TEXT NOT NULL,
        billing_address TEXT,
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        payment_status VARCHAR(50) DEFAULT 'pending',
        payment_method VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create order_items table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        product_name VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create customers table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        address TEXT,
        city VARCHAR(100),
        country VARCHAR(100),
        postal_code VARCHAR(20),
        total_orders INTEGER DEFAULT 0,
        total_spent DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create admin_users table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create blog_posts table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        featured_image VARCHAR(500),
        author_id INTEGER REFERENCES admin_users(id),
        status VARCHAR(50) DEFAULT 'draft',
        is_featured BOOLEAN DEFAULT false,
        meta_title VARCHAR(255),
        meta_description TEXT,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create transactions table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        transaction_id VARCHAR(255) UNIQUE NOT NULL,
        payment_method VARCHAR(100) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        status VARCHAR(50) NOT NULL,
        gateway_response TEXT,
        processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Check if admin user already exists
    const existingAdmin = await sql`
      SELECT id FROM admin_users WHERE email = ${process.env.ADMIN_EMAIL}
    `

    if (existingAdmin.length === 0) {
      // Create admin user
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 12)

      await sql`
        INSERT INTO admin_users (name, email, password_hash, role)
        VALUES ('Admin User', ${process.env.ADMIN_EMAIL}, ${hashedPassword}, 'admin')
      `
    }

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
        SET slug = ${slug}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${product.id}
      `
    }

    // Create sample categories if none exist
    const categoryCount = await sql`SELECT COUNT(*) as count FROM categories`
    if (categoryCount[0].count === "0") {
      const categories = [
        { name: "Sofas & Seating", slug: "sofas-seating", description: "Comfortable sofas and seating solutions" },
        { name: "Tables", slug: "tables", description: "Dining tables, coffee tables, and more" },
        { name: "Bedroom", slug: "bedroom", description: "Beds, wardrobes, and bedroom furniture" },
        { name: "Office Furniture", slug: "office-furniture", description: "Desks, chairs, and office solutions" },
        { name: "Storage", slug: "storage", description: "Cabinets, shelves, and storage solutions" },
      ]

      for (const category of categories) {
        await sql`
          INSERT INTO categories (name, slug, description)
          VALUES (${category.name}, ${category.slug}, ${category.description})
        `
      }
    }

    // Create sample orders if none exist
    const orderCount = await sql`SELECT COUNT(*) as count FROM orders`
    if (orderCount[0].count === "0") {
      const sampleOrders = [
        {
          order_number: "ORD-001",
          customer_name: "John Doe",
          customer_email: "john@example.com",
          customer_phone: "+1234567890",
          shipping_address: "123 Main St, City, State 12345",
          total_amount: 1299.99,
          status: "completed",
        },
        {
          order_number: "ORD-002",
          customer_name: "Jane Smith",
          customer_email: "jane@example.com",
          customer_phone: "+1234567891",
          shipping_address: "456 Oak Ave, City, State 12346",
          total_amount: 899.5,
          status: "processing",
        },
      ]

      for (const order of sampleOrders) {
        await sql`
          INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, shipping_address, total_amount, status)
          VALUES (${order.order_number}, ${order.customer_name}, ${order.customer_email}, ${order.customer_phone}, ${order.shipping_address}, ${order.total_amount}, ${order.status})
        `
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully!",
      adminCredentials: {
        email: process.env.ADMIN_EMAIL,
        password: "Check your environment variables",
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database initialization failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: `Database initialization failed: ${error.message}`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
