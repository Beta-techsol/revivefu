import { NextResponse, type NextRequest } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    console.log("🚀 Starting database initialization...")

    // Check existing tables and columns
    const existingTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    console.log(
      "Existing tables:",
      existingTables.map((t) => t.table_name),
    )

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

    // Create or update orders table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(100) UNIQUE NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50),
        shipping_address TEXT,
        billing_address TEXT,
        total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
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
        product_id INTEGER,
        product_name VARCHAR(255) NOT NULL,
        product_sku VARCHAR(100),
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create products table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock_quantity INTEGER DEFAULT 0,
        is_featured BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create customers table
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

    // Create sample data if tables are empty
    const orderCount = await sql`SELECT COUNT(*) as count FROM orders`
    if (Number.parseInt(orderCount[0].count) === 0) {
      // Create sample customers first
      const customers = [
        { name: "John Doe", email: "john@example.com", phone: "+1234567890", city: "New York", country: "USA" },
        { name: "Jane Smith", email: "jane@example.com", phone: "+1234567891", city: "Los Angeles", country: "USA" },
        { name: "Bob Johnson", email: "bob@example.com", phone: "+1234567892", city: "Chicago", country: "USA" },
      ]

      for (const customer of customers) {
        await sql`
          INSERT INTO customers (name, email, phone, city, country)
          VALUES (${customer.name}, ${customer.email}, ${customer.phone}, ${customer.city}, ${customer.country})
        `
      }

      // Create sample products
      const products = [
        { name: "Modern Sofa", price: 899.99, stock_quantity: 15 },
        { name: "Dining Table", price: 599.99, stock_quantity: 8 },
        { name: "Office Chair", price: 299.99, stock_quantity: 25 },
      ]

      for (const product of products) {
        const slug = product.name.toLowerCase().replace(/\s+/g, "-")
        await sql`
          INSERT INTO products (name, slug, price, stock_quantity)
          VALUES (${product.name}, ${slug}, ${product.price}, ${product.stock_quantity})
        `
      }

      // Create sample orders
      const sampleOrders = [
        {
          order_number: `ORD-${Date.now()}-001`,
          customer_name: "John Doe",
          customer_email: "john@example.com",
          customer_phone: "+1234567890",
          shipping_address: "123 Main St, New York, NY 10001",
          total_amount: 1299.99,
          status: "completed",
          payment_status: "paid",
          payment_method: "Credit Card",
        },
        {
          order_number: `ORD-${Date.now()}-002`,
          customer_name: "Jane Smith",
          customer_email: "jane@example.com",
          customer_phone: "+1234567891",
          shipping_address: "456 Oak Ave, Los Angeles, CA 90210",
          total_amount: 899.5,
          status: "processing",
          payment_status: "paid",
          payment_method: "PayPal",
        },
        {
          order_number: `ORD-${Date.now()}-003`,
          customer_name: "Bob Johnson",
          customer_email: "bob@example.com",
          customer_phone: "+1234567892",
          shipping_address: "789 Pine St, Chicago, IL 60601",
          total_amount: 599.99,
          status: "shipped",
          payment_status: "paid",
          payment_method: "Credit Card",
        },
        {
          order_number: `ORD-${Date.now()}-004`,
          customer_name: "Alice Brown",
          customer_email: "alice@example.com",
          shipping_address: "321 Elm St, Miami, FL 33101",
          total_amount: 1599.99,
          status: "pending",
          payment_status: "pending",
          payment_method: "Bank Transfer",
        },
      ]

      for (const order of sampleOrders) {
        const result = await sql`
          INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, shipping_address, total_amount, status, payment_status, payment_method)
          VALUES (${order.order_number}, ${order.customer_name}, ${order.customer_email}, ${order.customer_phone || null}, ${order.shipping_address}, ${order.total_amount}, ${order.status}, ${order.payment_status}, ${order.payment_method})
          RETURNING id
        `

        // Add sample order items
        await sql`
          INSERT INTO order_items (order_id, product_name, product_sku, quantity, unit_price, total_price)
          VALUES (${result[0].id}, 'Sample Product', 'SKU-001', 1, ${order.total_amount}, ${order.total_amount})
        `
      }
      console.log("✅ Sample data created")
    }

    console.log("🎉 Database initialization completed successfully!")

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      adminCredentials: {
        email: process.env.ADMIN_EMAIL,
        password: "Use your ADMIN_PASSWORD environment variable",
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
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
