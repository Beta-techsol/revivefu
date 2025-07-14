import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    console.log("Starting database initialization...")

    // First, let's check what columns exist in the orders table
    const orderColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orders' AND table_schema = 'public'
    `

    const existingOrderColumns = orderColumns.map((col) => col.column_name)
    console.log("Existing order columns:", existingOrderColumns)

    // Add missing columns to orders table
    if (!existingOrderColumns.includes("total_amount")) {
      await sql`ALTER TABLE orders ADD COLUMN total_amount DECIMAL(10,2)`
    }
    if (!existingOrderColumns.includes("customer_name")) {
      await sql`ALTER TABLE orders ADD COLUMN customer_name VARCHAR(255)`
    }
    if (!existingOrderColumns.includes("customer_email")) {
      await sql`ALTER TABLE orders ADD COLUMN customer_email VARCHAR(255)`
    }
    if (!existingOrderColumns.includes("customer_phone")) {
      await sql`ALTER TABLE orders ADD COLUMN customer_phone VARCHAR(50)`
    }
    if (!existingOrderColumns.includes("shipping_address")) {
      await sql`ALTER TABLE orders ADD COLUMN shipping_address TEXT`
    }
    if (!existingOrderColumns.includes("billing_address")) {
      await sql`ALTER TABLE orders ADD COLUMN billing_address TEXT`
    }
    if (!existingOrderColumns.includes("payment_status")) {
      await sql`ALTER TABLE orders ADD COLUMN payment_status VARCHAR(50) DEFAULT 'pending'`
    }
    if (!existingOrderColumns.includes("payment_method")) {
      await sql`ALTER TABLE orders ADD COLUMN payment_method VARCHAR(100)`
    }
    if (!existingOrderColumns.includes("order_number")) {
      await sql`ALTER TABLE orders ADD COLUMN order_number VARCHAR(100) UNIQUE`
    }

    // Check what columns exist in the products table
    const productColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND table_schema = 'public'
    `

    const existingProductColumns = productColumns.map((col) => col.column_name)
    console.log("Existing product columns:", existingProductColumns)

    // Add missing columns to products table
    if (!existingProductColumns.includes("slug")) {
      await sql`ALTER TABLE products ADD COLUMN slug VARCHAR(255)`
    }
    if (!existingProductColumns.includes("description")) {
      await sql`ALTER TABLE products ADD COLUMN description TEXT`
    }
    if (!existingProductColumns.includes("category_id")) {
      await sql`ALTER TABLE products ADD COLUMN category_id INTEGER`
    }
    if (!existingProductColumns.includes("stock_quantity")) {
      await sql`ALTER TABLE products ADD COLUMN stock_quantity INTEGER DEFAULT 0`
    }
    if (!existingProductColumns.includes("is_featured")) {
      await sql`ALTER TABLE products ADD COLUMN is_featured BOOLEAN DEFAULT false`
    }
    if (!existingProductColumns.includes("status")) {
      await sql`ALTER TABLE products ADD COLUMN status VARCHAR(50) DEFAULT 'active'`
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
        author VARCHAR(255) DEFAULT 'Admin',
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
      console.log("✅ Admin user created")
    } else {
      console.log("✅ Admin user already exists")
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
        SET slug = ${slug}
        WHERE id = ${product.id}
      `
    }

    if (productsWithoutSlugs.length > 0) {
      console.log(`✅ Updated ${productsWithoutSlugs.length} products with slugs`)
    }

    // Create sample categories if none exist
    const categoryCount = await sql`SELECT COUNT(*) as count FROM categories`
    if (Number.parseInt(categoryCount[0].count) === 0) {
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
      console.log("✅ Sample categories created")
    }

    // Create sample customers if none exist
    const customerCount = await sql`SELECT COUNT(*) as count FROM customers`
    if (Number.parseInt(customerCount[0].count) === 0) {
      const customers = [
        {
          name: "John Doe",
          email: "john@example.com",
          phone: "+1234567890",
          address: "123 Main St",
          city: "New York",
          country: "USA",
          postal_code: "10001",
        },
        {
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "+1234567891",
          address: "456 Oak Ave",
          city: "Los Angeles",
          country: "USA",
          postal_code: "90210",
        },
      ]

      for (const customer of customers) {
        await sql`
          INSERT INTO customers (name, email, phone, address, city, country, postal_code)
          VALUES (${customer.name}, ${customer.email}, ${customer.phone}, ${customer.address}, ${customer.city}, ${customer.country}, ${customer.postal_code})
        `
      }
      console.log("✅ Sample customers created")
    }

    // Create sample orders if none exist
    const orderCount = await sql`SELECT COUNT(*) as count FROM orders`
    if (Number.parseInt(orderCount[0].count) === 0) {
      const sampleOrders = [
        {
          order_number: `ORD-${Date.now()}-001`,
          customer_name: "John Doe",
          customer_email: "john@example.com",
          customer_phone: "+1234567890",
          shipping_address: "123 Main St, New York, NY 10001",
          billing_address: "123 Main St, New York, NY 10001",
          total_amount: 1299.99,
          status: "completed",
          payment_status: "paid",
          payment_method: "credit_card",
        },
        {
          order_number: `ORD-${Date.now()}-002`,
          customer_name: "Jane Smith",
          customer_email: "jane@example.com",
          customer_phone: "+1234567891",
          shipping_address: "456 Oak Ave, Los Angeles, CA 90210",
          billing_address: "456 Oak Ave, Los Angeles, CA 90210",
          total_amount: 899.5,
          status: "processing",
          payment_status: "paid",
          payment_method: "paypal",
        },
      ]

      for (const order of sampleOrders) {
        await sql`
          INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, shipping_address, billing_address, total_amount, status, payment_status, payment_method)
          VALUES (${order.order_number}, ${order.customer_name}, ${order.customer_email}, ${order.customer_phone}, ${order.shipping_address}, ${order.billing_address}, ${order.total_amount}, ${order.status}, ${order.payment_status}, ${order.payment_method})
        `
      }
      console.log("✅ Sample orders created")
    }

    // Create sample blog posts if none exist
    const blogCount = await sql`SELECT COUNT(*) as count FROM blog_posts`
    if (Number.parseInt(blogCount[0].count) === 0) {
      const blogPosts = [
        {
          title: "Welcome to Revive Furniture",
          slug: "welcome-to-revive-furniture",
          content:
            "Welcome to our furniture store! We specialize in high-quality, modern furniture that transforms your living space. Our collection features carefully curated pieces that blend style, comfort, and functionality.",
          excerpt: "Discover our collection of premium furniture designed for modern living.",
          author: "Admin User",
          status: "published",
          published_at: new Date().toISOString(),
        },
        {
          title: "How to Choose the Perfect Sofa",
          slug: "how-to-choose-perfect-sofa",
          content:
            "Choosing the right sofa is crucial for your living room. Consider factors like size, material, color, and comfort level. Our guide will help you make the perfect choice for your space.",
          excerpt: "A comprehensive guide to selecting the ideal sofa for your home.",
          author: "Admin User",
          status: "published",
          published_at: new Date().toISOString(),
        },
      ]

      for (const post of blogPosts) {
        await sql`
          INSERT INTO blog_posts (title, slug, content, excerpt, author, status, published_at)
          VALUES (${post.title}, ${post.slug}, ${post.content}, ${post.excerpt}, ${post.author}, ${post.status}, ${post.published_at})
        `
      }
      console.log("✅ Sample blog posts created")
    }

    // Create sample transactions if none exist
    const transactionCount = await sql`SELECT COUNT(*) as count FROM transactions`
    if (Number.parseInt(transactionCount[0].count) === 0) {
      const orders = await sql`SELECT id, total_amount FROM orders LIMIT 2`

      if (orders.length > 0) {
        const transactions = [
          {
            order_id: orders[0].id,
            transaction_id: `TXN-${Date.now()}-001`,
            payment_method: "credit_card",
            amount: orders[0].total_amount,
            status: "completed",
          },
          {
            order_id: orders[1]?.id || orders[0].id,
            transaction_id: `TXN-${Date.now()}-002`,
            payment_method: "paypal",
            amount: orders[1]?.total_amount || orders[0].total_amount,
            status: "completed",
          },
        ]

        for (const transaction of transactions) {
          await sql`
            INSERT INTO transactions (order_id, transaction_id, payment_method, amount, status)
            VALUES (${transaction.order_id}, ${transaction.transaction_id}, ${transaction.payment_method}, ${transaction.amount}, ${transaction.status})
          `
        }
        console.log("✅ Sample transactions created")
      }
    }

    console.log("🎉 Database initialization completed successfully!")

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully!",
      adminCredentials: {
        email: process.env.ADMIN_EMAIL,
        note: "Use your ADMIN_PASSWORD environment variable to login",
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

export async function POST() {
  return GET()
}
