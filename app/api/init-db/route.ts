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
    console.log("Dropping existing tables...")
    await sql`DROP TABLE IF EXISTS order_items CASCADE`
    await sql`DROP TABLE IF EXISTS orders CASCADE`
    await sql`DROP TABLE IF EXISTS products CASCADE`
    await sql`DROP TABLE IF EXISTS categories CASCADE`
    await sql`DROP TABLE IF EXISTS customers CASCADE`
    await sql`DROP TABLE IF EXISTS admin_users CASCADE`

    console.log("✅ Existing tables dropped")

    // Create admin_users table
    console.log("Creating admin_users table...")
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

    // Create categories table
    console.log("Creating categories table...")
    await sql`
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create products table
    console.log("Creating products table...")
    await sql`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        short_description TEXT,
        price DECIMAL(10,2) NOT NULL,
        sale_price DECIMAL(10,2),
        sku VARCHAR(100) UNIQUE,
        stock_quantity INTEGER DEFAULT 0,
        category_id INTEGER REFERENCES categories(id),
        images TEXT[], -- Array of image URLs
        is_featured BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        weight DECIMAL(8,2),
        dimensions VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create customers table
    console.log("Creating customers table...")
    await sql`
      CREATE TABLE customers (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        postal_code VARCHAR(20),
        country VARCHAR(100) DEFAULT 'Pakistan',
        date_of_birth DATE,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create orders table
    console.log("Creating orders table...")
    await sql`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        customer_id INTEGER REFERENCES customers(id),
        status VARCHAR(50) DEFAULT 'pending',
        total_amount DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        tax_amount DECIMAL(10,2) DEFAULT 0,
        shipping_amount DECIMAL(10,2) DEFAULT 0,
        discount_amount DECIMAL(10,2) DEFAULT 0,
        payment_method VARCHAR(100),
        payment_status VARCHAR(50) DEFAULT 'pending',
        shipping_address TEXT,
        billing_address TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create order_items table
    console.log("Creating order_items table...")
    await sql`
      CREATE TABLE order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("✅ All tables created successfully")

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || "admin@furniture.com"
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123"
    const hashedPassword = await bcrypt.hash(adminPassword, 12)

    console.log("Creating admin user...")
    await sql`
      INSERT INTO admin_users (name, email, password_hash, role)
      VALUES ('Admin User', ${adminEmail}, ${hashedPassword}, 'admin')
    `

    // Create sample categories
    console.log("Inserting sample categories...")
    await sql`
      INSERT INTO categories (name, slug, description, image_url) VALUES
      ('Living Room', 'living-room', 'Comfortable furniture for your living space', '/placeholder.svg?height=200&width=200'),
      ('Bedroom', 'bedroom', 'Rest and relaxation furniture', '/placeholder.svg?height=200&width=200'),
      ('Dining Room', 'dining-room', 'Dining tables and chairs', '/placeholder.svg?height=200&width=200'),
      ('Office', 'office', 'Professional workspace furniture', '/placeholder.svg?height=200&width=200'),
      ('Outdoor', 'outdoor', 'Weather-resistant outdoor furniture', '/placeholder.svg?height=200&width=200')
    `

    // Create sample products
    console.log("Inserting sample products...")
    await sql`
      INSERT INTO products (name, slug, description, short_description, price, sale_price, sku, stock_quantity, category_id, images, is_featured) VALUES
      ('Modern Sofa Set', 'modern-sofa-set', 'Comfortable 3-seater sofa perfect for modern living rooms', 'Comfortable 3-seater sofa', 89999.00, 79999.00, 'SOF001', 15, 1, ARRAY['/shop/products/sofa-1.jpg', '/shop/products/sofa-2.jpg'], true),
      ('Executive Office Chair', 'executive-office-chair', 'Ergonomic office chair with lumbar support', 'Ergonomic office chair', 25999.00, NULL, 'CHR001', 25, 4, ARRAY['/shop/products/chair-1.jpg'], true),
      ('Dining Table Set', 'dining-table-set', '6-seater wooden dining table with chairs', '6-seater dining set', 65999.00, 59999.00, 'DIN001', 8, 3, ARRAY['/shop/products/dining-table-1.jpg'], false),
      ('Queen Size Bed', 'queen-size-bed', 'Comfortable queen size bed with storage', 'Queen bed with storage', 45999.00, NULL, 'BED001', 12, 2, ARRAY['/shop/products/bed-1.jpg'], true),
      ('Coffee Table', 'coffee-table', 'Modern glass coffee table', 'Glass coffee table', 15999.00, 12999.00, 'COF001', 20, 1, ARRAY['/shop/products/coffee-table-1.jpg'], false),
      ('Wardrobe', 'wardrobe', '4-door wardrobe with mirror', '4-door wardrobe', 55999.00, NULL, 'WAR001', 6, 2, ARRAY['/shop/products/wardrobe-1.jpg'], false)
    `

    // Create sample customers
    console.log("Inserting sample customers...")
    await sql`
      INSERT INTO customers (first_name, last_name, email, phone, address, city, state, postal_code) VALUES
      ('Ahmed', 'Khan', 'ahmed.khan@email.com', '+92-300-1234567', 'House 123, Block A, Gulberg', 'Lahore', 'Punjab', '54000'),
      ('Fatima', 'Ali', 'fatima.ali@email.com', '+92-321-9876543', 'Flat 45, DHA Phase 2', 'Karachi', 'Sindh', '75500'),
      ('Muhammad', 'Hassan', 'hassan@email.com', '+92-333-5555555', 'Street 15, F-8/2', 'Islamabad', 'ICT', '44000'),
      ('Ayesha', 'Sheikh', 'ayesha.sheikh@email.com', '+92-300-7777777', 'House 67, Johar Town', 'Lahore', 'Punjab', '54782'),
      ('Omar', 'Malik', 'omar.malik@email.com', '+92-345-8888888', 'Plot 89, Clifton', 'Karachi', 'Sindh', '75600')
    `

    // Create sample orders
    console.log("Inserting sample orders...")
    await sql`
      INSERT INTO orders (order_number, customer_id, status, total_amount, subtotal, tax_amount, shipping_amount, payment_method, payment_status, shipping_address) VALUES
      ('ORD-2024-001', 1, 'completed', 85999.00, 79999.00, 4000.00, 2000.00, 'Credit Card', 'paid', 'House 123, Block A, Gulberg, Lahore'),
      ('ORD-2024-002', 2, 'processing', 27999.00, 25999.00, 1300.00, 700.00, 'Bank Transfer', 'paid', 'Flat 45, DHA Phase 2, Karachi'),
      ('ORD-2024-003', 3, 'pending', 67999.00, 59999.00, 6000.00, 2000.00, 'Cash on Delivery', 'pending', 'Street 15, F-8/2, Islamabad'),
      ('ORD-2024-004', 4, 'shipped', 47999.00, 45999.00, 1800.00, 200.00, 'Credit Card', 'paid', 'House 67, Johar Town, Lahore'),
      ('ORD-2024-005', 5, 'delivered', 17999.00, 15999.00, 1600.00, 400.00, 'JazzCash', 'paid', 'Plot 89, Clifton, Karachi')
    `

    // Create sample order items
    console.log("Inserting sample order items...")
    await sql`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES
      (1, 1, 1, 79999.00, 79999.00),
      (2, 2, 1, 25999.00, 25999.00),
      (3, 3, 1, 59999.00, 59999.00),
      (4, 4, 1, 45999.00, 45999.00),
      (5, 5, 1, 15999.00, 15999.00)
    `

    console.log("🎉 Database initialization completed successfully!")

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully with sample data",
      adminCredentials: {
        email: adminEmail,
        password: "Check your environment variables",
      },
    })
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: `Database initialization failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  return GET() // Allow both GET and POST requests
}
