import { NextResponse, type NextRequest } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    console.log("🚀 Starting database initialization...")

    // Check if we can connect to the database
    try {
      await sql`SELECT 1`
      console.log("✅ Database connection successful")
    } catch (error) {
      console.error("❌ Database connection failed:", error)
      return NextResponse.json(
        {
          success: false,
          error: `Database connection failed: ${error.message}`,
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    // Drop existing tables if they exist to start fresh
    await sql`DROP TABLE IF EXISTS order_items CASCADE`
    await sql`DROP TABLE IF EXISTS orders CASCADE`
    await sql`DROP TABLE IF EXISTS customers CASCADE`
    await sql`DROP TABLE IF EXISTS products CASCADE`
    await sql`DROP TABLE IF EXISTS admin_users CASCADE`

    console.log("✅ Existing tables dropped")

    // Create admin_users table
    await sql`
      CREATE TABLE admin_users (
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

    // Create customers table
    await sql`
      CREATE TABLE customers (
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

    // Create products table
    await sql`
      CREATE TABLE products (
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

    // Create orders table
    await sql`
      CREATE TABLE orders (
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

    // Create order_items table
    await sql`
      CREATE TABLE order_items (
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

    console.log("✅ All tables created successfully")

    // Create admin user
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 12)

    await sql`
      INSERT INTO admin_users (name, email, password_hash, role)
      VALUES ('Admin User', ${process.env.ADMIN_EMAIL}, ${hashedPassword}, 'admin')
    `
    console.log("✅ Admin user created")

    // Create sample customers
    const customers = [
      { name: "John Doe", email: "john@example.com", phone: "+1234567890", city: "New York", country: "USA" },
      { name: "Jane Smith", email: "jane@example.com", phone: "+1234567891", city: "Los Angeles", country: "USA" },
      { name: "Bob Johnson", email: "bob@example.com", phone: "+1234567892", city: "Chicago", country: "USA" },
      { name: "Alice Brown", email: "alice@example.com", phone: "+1234567893", city: "Miami", country: "USA" },
    ]

    for (const customer of customers) {
      await sql`
        INSERT INTO customers (name, email, phone, city, country)
        VALUES (${customer.name}, ${customer.email}, ${customer.phone}, ${customer.city}, ${customer.country})
      `
    }
    console.log("✅ Sample customers created")

    // Create sample products
    const products = [
      { name: "Modern Sofa", slug: "modern-sofa", price: 899.99, stock_quantity: 15 },
      { name: "Dining Table", slug: "dining-table", price: 599.99, stock_quantity: 8 },
      { name: "Office Chair", slug: "office-chair", price: 299.99, stock_quantity: 25 },
      { name: "Coffee Table", slug: "coffee-table", price: 199.99, stock_quantity: 12 },
    ]

    for (const product of products) {
      await sql`
        INSERT INTO products (name, slug, price, stock_quantity)
        VALUES (${product.name}, ${product.slug}, ${product.price}, ${product.stock_quantity})
      `
    }
    console.log("✅ Sample products created")

    // Create sample orders
    const timestamp = Date.now()
    const sampleOrders = [
      {
        order_number: `ORD-${timestamp}-001`,
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
        order_number: `ORD-${timestamp}-002`,
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
        order_number: `ORD-${timestamp}-003`,
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
        order_number: `ORD-${timestamp}-004`,
        customer_name: "Alice Brown",
        customer_email: "alice@example.com",
        customer_phone: "+1234567893",
        shipping_address: "321 Elm St, Miami, FL 33101",
        total_amount: 1599.99,
        status: "pending",
        payment_status: "pending",
        payment_method: "Bank Transfer",
      },
      {
        order_number: `ORD-${timestamp}-005`,
        customer_name: "Charlie Wilson",
        customer_email: "charlie@example.com",
        shipping_address: "555 Broadway, Seattle, WA 98101",
        total_amount: 799.99,
        status: "cancelled",
        payment_status: "refunded",
        payment_method: "Credit Card",
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
    console.log("✅ Sample orders created")

    console.log("🎉 Database initialization completed successfully!")

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully with fresh data",
      adminCredentials: {
        email: process.env.ADMIN_EMAIL,
        password: "Use your ADMIN_PASSWORD environment variable",
      },
      tablesCreated: ["admin_users", "customers", "products", "orders", "order_items"],
      sampleDataCreated: {
        customers: customers.length,
        products: products.length,
        orders: sampleOrders.length,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: `Database initialization failed: ${error.message}`,
        details: error.stack,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  return GET()
}
