import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    console.log("=== FIXING SCHEMA ISSUES ===")

    // Check if image_url column exists
    const imageUrlExists = await sql`
      SELECT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'products' 
          AND column_name = 'image_url'
      ) as exists
    `

    // Check if images column exists
    const imagesExists = await sql`
      SELECT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'products' 
          AND column_name = 'images'
      ) as exists
    `

    const fixes = []

    // If image_url doesn't exist but we need it for compatibility
    if (!imageUrlExists[0].exists && !imagesExists[0].exists) {
      // Add images column if neither exists
      await sql`
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS images TEXT
      `
      fixes.push("Added images column to products table")
    }

    // Check order_items table structure
    const orderItemsColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'order_items'
    `

    const hasProductIdColumn = orderItemsColumns.some((col) => col.column_name === "product_id")

    if (!hasProductIdColumn) {
      await sql`
        ALTER TABLE order_items 
        ADD COLUMN IF NOT EXISTS product_id INTEGER REFERENCES products(id)
      `
      fixes.push("Added product_id column to order_items table")
    }

    // Check if order_status_history table exists
    const statusHistoryExists = await sql`
      SELECT EXISTS (
          SELECT 1 
          FROM information_schema.tables 
          WHERE table_name = 'order_status_history'
      ) as exists
    `

    if (!statusHistoryExists[0].exists) {
      await sql`
        CREATE TABLE IF NOT EXISTS order_status_history (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
          status VARCHAR(50) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
      fixes.push("Created order_status_history table")
    }

    return NextResponse.json({
      success: true,
      message: "Schema fixes applied successfully",
      fixes,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fixing schema:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
