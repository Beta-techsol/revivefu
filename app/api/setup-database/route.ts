import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST() {
  try {
    console.log("🚀 Starting database setup...")

    // Test connection first
    await sql`SELECT 1`
    console.log("✅ Database connection successful")

    // Enable UUID extension
    try {
      await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
      console.log("✅ UUID extension enabled")
    } catch (error) {
      console.log("⚠️ UUID extension already exists or not needed")
    }

    // Drop existing tables if they exist (for clean setup)
    console.log("🗑️ Dropping existing tables...")
    await sql`DROP TABLE IF EXISTS order_items CASCADE`
    await sql`DROP TABLE IF EXISTS orders CASCADE`
    await sql`DROP TABLE IF EXISTS product_variants CASCADE`
    await sql`DROP TABLE IF EXISTS products CASCADE`
    await sql`DROP TABLE IF EXISTS categories CASCADE`
    await sql`DROP TABLE IF EXISTS users CASCADE`
    await sql`DROP TABLE IF EXISTS blog_posts CASCADE`
    await sql`DROP TABLE IF EXISTS transactions CASCADE`
    await sql`DROP TABLE IF EXISTS customers CASCADE`

    // Create categories table
    console.log("📂 Creating categories table...")
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

    // Create products table
    console.log("🛋️ Creating products table...")
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        short_description TEXT,
        sku VARCHAR(100) UNIQUE NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        compare_price DECIMAL(10,2),
        cost DECIMAL(10,2),
        category_id INTEGER REFERENCES categories(id),
        stock_quantity INTEGER DEFAULT 0,
        track_quantity BOOLEAN DEFAULT true,
        continue_selling BOOLEAN DEFAULT false,
        weight DECIMAL(8,2),
        dimensions JSONB,
        material VARCHAR(255),
        color VARCHAR(100),
        brand VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        images JSONB DEFAULT '[]',
        primary_image_index INTEGER DEFAULT 0,
        tags JSONB DEFAULT '[]',
        is_featured BOOLEAN DEFAULT false,
        is_trending BOOLEAN DEFAULT false,
        is_best_seller BOOLEAN DEFAULT false,
        is_hot_selling BOOLEAN DEFAULT false,
        is_deal_of_day BOOLEAN DEFAULT false,
        is_latest BOOLEAN DEFAULT false,
        room_type VARCHAR(100),
        meta_title VARCHAR(255),
        meta_description TEXT,
        average_rating DECIMAL(3,2) DEFAULT 0,
        review_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create product_variants table
    console.log("🎨 Creating product_variants table...")
    await sql`
      CREATE TABLE IF NOT EXISTS product_variants (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        color VARCHAR(100),
        size VARCHAR(100),
        material VARCHAR(255),
        price DECIMAL(10,2),
        compare_price DECIMAL(10,2),
        stock INTEGER DEFAULT 0,
        sku VARCHAR(100),
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create users table for admin
    console.log("👤 Creating users table...")
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create customers table
    console.log("👥 Creating customers table...")
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

    // Create orders table
    console.log("📦 Creating orders table...")
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(50) NOT NULL UNIQUE,
        customer_email VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50),
        billing_address JSONB NOT NULL,
        shipping_address JSONB NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        tax_amount DECIMAL(10,2) DEFAULT 0,
        shipping_amount DECIMAL(10,2) DEFAULT 0,
        discount_amount DECIMAL(10,2) DEFAULT 0,
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        payment_status VARCHAR(50) DEFAULT 'pending',
        payment_method VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create order_items table
    console.log("📋 Creating order_items table...")
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        variant_id INTEGER REFERENCES product_variants(id) ON DELETE SET NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create blog_posts table
    console.log("📝 Creating blog_posts table...")
    await sql`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        featured_image VARCHAR(500),
        author_id INTEGER REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'draft',
        is_featured BOOLEAN DEFAULT false,
        meta_title VARCHAR(255),
        meta_description TEXT,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create transactions table
    console.log("💳 Creating transactions table...")
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

    // Create indexes for better performance
    console.log("🔍 Creating indexes...")
    await sql`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_products_status ON products(status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured)`
    await sql`CREATE INDEX IF NOT EXISTS idx_products_trending ON products(is_trending)`
    await sql`CREATE INDEX IF NOT EXISTS idx_products_best_seller ON products(is_best_seller)`
    await sql`CREATE INDEX IF NOT EXISTS idx_products_room_type ON products(room_type)`
    await sql`CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at)`
    await sql`CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at)`

    // Insert sample categories
    console.log("📂 Inserting default categories...")
    await sql`
      INSERT INTO categories (name, slug, description) VALUES
      ('Living Room', 'living-room', 'Furniture for your living space'),
      ('Bedroom', 'bedroom', 'Comfortable bedroom furniture'),
      ('Dining Room', 'dining-room', 'Dining tables, chairs and storage'),
      ('Office', 'office', 'Professional office furniture'),
      ('Outdoor', 'outdoor', 'Patio and garden furniture')
      ON CONFLICT (slug) DO NOTHING
    `

    // Insert admin user
    console.log("👤 Creating admin user...")
    const adminEmail = process.env.ADMIN_EMAIL || "admin@revivefurniture.com"
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123"
    const hashedPassword = await bcrypt.hash(adminPassword, 12)

    await sql`
      INSERT INTO users (email, password, name, role) VALUES
      (${adminEmail}, ${hashedPassword}, 'Admin User', 'admin')
      ON CONFLICT (email) DO NOTHING
    `

    // Insert sample products
    console.log("🛋️ Inserting sample products...")
    await sql`
      INSERT INTO products (
        name, slug, description, short_description, sku, price, compare_price,
        category_id, stock_quantity, material, color, brand, status,
        images, is_featured, is_trending, room_type
      ) VALUES
      (
        'Modern Sectional Sofa',
        'modern-sectional-sofa',
        'A comfortable and stylish sectional sofa perfect for modern living rooms.',
        'Comfortable sectional sofa',
        'SOF-001',
        1299.99,
        1599.99,
        1,
        15,
        'Fabric',
        'Gray',
        'ModernHome',
        'active',
        '["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500"]',
        true,
        true,
        'living-room'
      ),
      (
        'Oak Dining Table',
        'oak-dining-table',
        'Beautiful solid oak dining table that seats up to 6 people comfortably.',
        'Solid oak dining table',
        'TAB-001',
        899.99,
        1199.99,
        3,
        8,
        'Oak Wood',
        'Natural',
        'WoodCraft',
        'active',
        '["https://images.unsplash.com/photo-1549497538-303791108f95?w=500"]',
        true,
        false,
        'dining-room'
      ),
      (
        'Ergonomic Office Chair',
        'ergonomic-office-chair',
        'Professional ergonomic office chair with lumbar support and adjustable height.',
        'Ergonomic office chair',
        'CHR-001',
        399.99,
        499.99,
        4,
        25,
        'Mesh',
        'Black',
        'ErgoMax',
        'active',
        '["https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500"]',
        false,
        true,
        'office'
      )
      ON CONFLICT (sku) DO NOTHING
    `

    // Insert sample orders
    console.log("📦 Inserting sample orders...")
    const sampleOrders = [
      {
        order_number: "ORD-2024-001",
        customer_name: "John Doe",
        customer_email: "john@example.com",
        customer_phone: "+1234567890",
        billing_address: JSON.stringify({
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zip: "10001",
          country: "USA",
        }),
        shipping_address: JSON.stringify({
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zip: "10001",
          country: "USA",
        }),
        subtotal: 1299.99,
        tax_amount: 104.0,
        shipping_amount: 50.0,
        total_amount: 1453.99,
        status: "completed",
        payment_status: "paid",
      },
      {
        order_number: "ORD-2024-002",
        customer_name: "Jane Smith",
        customer_email: "jane@example.com",
        customer_phone: "+1234567891",
        billing_address: JSON.stringify({
          street: "456 Oak Ave",
          city: "Los Angeles",
          state: "CA",
          zip: "90210",
          country: "USA",
        }),
        shipping_address: JSON.stringify({
          street: "456 Oak Ave",
          city: "Los Angeles",
          state: "CA",
          zip: "90210",
          country: "USA",
        }),
        subtotal: 599.99,
        tax_amount: 48.0,
        shipping_amount: 25.0,
        total_amount: 672.99,
        status: "processing",
        payment_status: "paid",
      },
    ]

    for (const order of sampleOrders) {
      await sql`
        INSERT INTO orders (
          order_number, customer_name, customer_email, customer_phone,
          billing_address, shipping_address, subtotal, tax_amount,
          shipping_amount, total_amount, status, payment_status
        )
        VALUES (
          ${order.order_number}, ${order.customer_name}, ${order.customer_email},
          ${order.customer_phone}, ${order.billing_address}, ${order.shipping_address},
          ${order.subtotal}, ${order.tax_amount}, ${order.shipping_amount},
          ${order.total_amount}, ${order.status}, ${order.payment_status}
        )
      `
    }

    console.log("✅ Database setup completed successfully!")

    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully!",
      details: {
        tablesCreated: [
          "categories",
          "products",
          "product_variants",
          "users",
          "customers",
          "orders",
          "order_items",
          "blog_posts",
          "transactions",
        ],
        sampleDataInserted: {
          categories: 5,
          products: 3,
          orders: 2,
        },
        adminCredentials: {
          email: adminEmail,
          password: adminPassword,
        },
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("❌ Database setup failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.stack,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return POST()
}
