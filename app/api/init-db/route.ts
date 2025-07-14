import { NextResponse, type NextRequest } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

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

    // Drop existing tables in correct order (reverse of creation due to foreign keys)
    await sql`DROP TABLE IF EXISTS order_items CASCADE`
    await sql`DROP TABLE IF EXISTS orders CASCADE`
    await sql`DROP TABLE IF EXISTS products CASCADE`
    await sql`DROP TABLE IF EXISTS categories CASCADE`
    await sql`DROP TABLE IF EXISTS customers CASCADE`
    await sql`DROP TABLE IF EXISTS users CASCADE`

    console.log("✅ Existing tables dropped")

    // Create users table
    await sql`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create categories table
    await sql`
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create products table
    await sql`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        sale_price DECIMAL(10,2),
        sku VARCHAR(100) UNIQUE,
        stock_quantity INTEGER DEFAULT 0,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        images TEXT[],
        status VARCHAR(50) DEFAULT 'active',
        featured BOOLEAN DEFAULT false,
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
        state VARCHAR(100),
        postal_code VARCHAR(20),
        country VARCHAR(100) DEFAULT 'Pakistan',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create orders table
    await sql`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(100) UNIQUE NOT NULL,
        customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50),
        shipping_address TEXT NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        payment_status VARCHAR(50) DEFAULT 'pending',
        payment_method VARCHAR(50),
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
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        product_name VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("✅ All tables created successfully")

    // Hash admin password
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10)

    // Insert admin user
    await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (
        'Admin User',
        ${process.env.ADMIN_EMAIL || "admin@furniture.com"},
        ${hashedPassword},
        'admin'
      )
    `

    // Insert sample categories
    await sql`
      INSERT INTO categories (name, slug, description, image_url) VALUES
      ('Living Room', 'living-room', 'Comfortable furniture for your living space', '/shop/products/sofa-1.jpg'),
      ('Bedroom', 'bedroom', 'Rest and relaxation furniture', '/shop/products/bed-1.jpg'),
      ('Dining Room', 'dining-room', 'Perfect for family meals', '/shop/products/dining-table-1.jpg'),
      ('Office', 'office', 'Professional workspace furniture', '/shop/products/chair-1.jpg')
    `

    // Insert sample products
    await sql`
      INSERT INTO products (name, slug, description, price, sale_price, sku, stock_quantity, category_id, images, featured) VALUES
      ('Modern Sofa Set', 'modern-sofa-set', 'Comfortable 3-seater sofa perfect for modern homes', 1299.99, 999.99, 'SOFA-001', 15, 1, ARRAY['/shop/products/sofa-1.jpg', '/shop/products/sofa-2.jpg'], true),
      ('Executive Office Chair', 'executive-office-chair', 'Ergonomic office chair with lumbar support', 399.99, 299.99, 'CHAIR-001', 25, 4, ARRAY['/shop/products/chair-1.jpg'], true),
      ('Dining Table Set', 'dining-table-set', '6-seater wooden dining table with chairs', 899.99, 699.99, 'TABLE-001', 8, 3, ARRAY['/shop/products/dining-table-1.jpg'], false),
      ('Queen Size Bed', 'queen-size-bed', 'Comfortable queen size bed with storage', 799.99, 599.99, 'BED-001', 12, 2, ARRAY['/shop/products/bed-1.jpg'], true),
      ('Coffee Table', 'coffee-table', 'Modern glass coffee table', 299.99, 199.99, 'TABLE-002', 20, 1, ARRAY['/shop/products/coffee-table-1.jpg'], false),
      ('Wardrobe', 'wardrobe', 'Spacious 4-door wardrobe', 1199.99, 899.99, 'WARD-001', 6, 2, ARRAY['/shop/products/wardrobe-1.jpg'], false)
    `

    // Insert sample customers
    await sql`
      INSERT INTO customers (name, email, phone, address, city, state, postal_code) VALUES
      ('John Smith', 'john.smith@email.com', '+92-300-1234567', '123 Main Street, Block A', 'Karachi', 'Sindh', '75500'),
      ('Sarah Johnson', 'sarah.johnson@email.com', '+92-301-2345678', '456 Oak Avenue, DHA Phase 2', 'Lahore', 'Punjab', '54000'),
      ('Ahmed Ali', 'ahmed.ali@email.com', '+92-302-3456789', '789 Pine Road, F-8 Sector', 'Islamabad', 'ICT', '44000'),
      ('Maria Garcia', 'maria.garcia@email.com', '+92-303-4567890', '321 Elm Street, Gulshan-e-Iqbal', 'Karachi', 'Sindh', '75300'),
      ('David Wilson', 'david.wilson@email.com', '+92-304-5678901', '654 Maple Drive, Model Town', 'Lahore', 'Punjab', '54700')
    `

    // Insert sample orders
    await sql`
      INSERT INTO orders (order_number, customer_id, customer_name, customer_email, customer_phone, shipping_address, total_amount, status, payment_status, payment_method) VALUES
      ('ORD-2024-001', 1, 'John Smith', 'john.smith@email.com', '+92-300-1234567', '123 Main Street, Block A, Karachi, Sindh 75500', 999.99, 'completed', 'paid', 'credit_card'),
      ('ORD-2024-002', 2, 'Sarah Johnson', 'sarah.johnson@email.com', '+92-301-2345678', '456 Oak Avenue, DHA Phase 2, Lahore, Punjab 54000', 299.99, 'processing', 'paid', 'bank_transfer'),
      ('ORD-2024-003', 3, 'Ahmed Ali', 'ahmed.ali@email.com', '+92-302-3456789', '789 Pine Road, F-8 Sector, Islamabad, ICT 44000', 699.99, 'shipped', 'paid', 'cash_on_delivery'),
      ('ORD-2024-004', 4, 'Maria Garcia', 'maria.garcia@email.com', '+92-303-4567890', '321 Elm Street, Gulshan-e-Iqbal, Karachi, Sindh 75300', 599.99, 'pending', 'pending', 'credit_card'),
      ('ORD-2024-005', 5, 'David Wilson', 'david.wilson@email.com', '+92-304-5678901', '654 Maple Drive, Model Town, Lahore, Punjab 54700', 1199.99, 'completed', 'paid', 'bank_transfer')
    `

    // Insert sample order items
    await sql`
      INSERT INTO order_items (order_id, product_id, product_name, quantity, price, total) VALUES
      (1, 1, 'Modern Sofa Set', 1, 999.99, 999.99),
      (2, 2, 'Executive Office Chair', 1, 299.99, 299.99),
      (3, 3, 'Dining Table Set', 1, 699.99, 699.99),
      (4, 4, 'Queen Size Bed', 1, 599.99, 599.99),
      (5, 6, 'Wardrobe', 1, 899.99, 899.99),
      (5, 5, 'Coffee Table', 1, 199.99, 199.99)
    `

    console.log("🎉 Database initialization completed successfully!")

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully with sample data",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Database initialization failed: " + (error instanceof Error ? error.message : "Unknown error"),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  return GET() // Allow both GET and POST requests
}
