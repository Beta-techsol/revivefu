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

    // Add missing columns to existing tables
    try {
      // Check if orders table exists and add missing columns
      const orderColumns = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'orders' AND table_schema = 'public'
      `

      const existingOrderColumns = orderColumns.map((col) => col.column_name)

      if (!existingOrderColumns.includes("customer_name")) {
        await sql`ALTER TABLE orders ADD COLUMN customer_name VARCHAR(255)`
      }
      if (!existingOrderColumns.includes("customer_email")) {
        await sql`ALTER TABLE orders ADD COLUMN customer_email VARCHAR(255)`
      }
      if (!existingOrderColumns.includes("order_number")) {
        await sql`ALTER TABLE orders ADD COLUMN order_number VARCHAR(100)`
      }
      if (!existingOrderColumns.includes("total_amount")) {
        await sql`ALTER TABLE orders ADD COLUMN total_amount DECIMAL(10,2)`
      }
      if (!existingOrderColumns.includes("payment_method")) {
        await sql`ALTER TABLE orders ADD COLUMN payment_method VARCHAR(100)`
      }
      if (!existingOrderColumns.includes("shipping_address")) {
        await sql`ALTER TABLE orders ADD COLUMN shipping_address TEXT`
      }

      console.log("✅ Orders table columns updated")
    } catch (error) {
      console.log("Orders table update:", error.message)
    }

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

    // Update existing orders with missing data
    const ordersWithoutNumbers = await sql`
      SELECT id FROM orders WHERE order_number IS NULL OR order_number = ''
    `

    for (const order of ordersWithoutNumbers) {
      const orderNumber = `ORD-${Date.now()}-${order.id}`
      await sql`
        UPDATE orders 
        SET order_number = ${orderNumber},
            customer_name = COALESCE(customer_name, 'Customer'),
            customer_email = COALESCE(customer_email, 'customer@example.com'),
            total_amount = COALESCE(total_amount, total, 0),
            payment_method = COALESCE(payment_method, 'Credit Card')
        WHERE id = ${order.id}
      `
    }

    // Create sample orders if none exist
    const orderCount = await sql`SELECT COUNT(*) as count FROM orders`
    if (Number.parseInt(orderCount[0].count) === 0) {
      const sampleOrders = [
        {
          order_number: `ORD-${Date.now()}-001`,
          customer_name: "John Doe",
          customer_email: "john@example.com",
          total_amount: 1299.99,
          status: "completed",
          payment_method: "Credit Card",
          shipping_address: "123 Main St, New York, NY 10001",
        },
        {
          order_number: `ORD-${Date.now()}-002`,
          customer_name: "Jane Smith",
          customer_email: "jane@example.com",
          total_amount: 899.5,
          status: "processing",
          payment_method: "PayPal",
          shipping_address: "456 Oak Ave, Los Angeles, CA 90210",
        },
        {
          order_number: `ORD-${Date.now()}-003`,
          customer_name: "Bob Johnson",
          customer_email: "bob@example.com",
          total_amount: 599.99,
          status: "shipped",
          payment_method: "Credit Card",
          shipping_address: "789 Pine St, Chicago, IL 60601",
        },
      ]

      for (const order of sampleOrders) {
        const result = await sql`
          INSERT INTO orders (order_number, customer_name, customer_email, total_amount, status, payment_method, shipping_address)
          VALUES (${order.order_number}, ${order.customer_name}, ${order.customer_email}, ${order.total_amount}, ${order.status}, ${order.payment_method}, ${order.shipping_address})
          RETURNING id
        `

        // Add sample order items
        await sql`
          INSERT INTO order_items (order_id, product_name, product_sku, quantity, unit_price, total_price)
          VALUES (${result[0].id}, 'Sample Product', 'SKU-001', 1, ${order.total_amount}, ${order.total_amount})
        `
      }
      console.log("✅ Sample orders created")
    }

    console.log("🎉 Database initialization completed successfully!")

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      adminCredentials: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
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
