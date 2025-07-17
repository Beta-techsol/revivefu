import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || "sofa"

    console.log("Debug Search API - Starting with query:", query)

    // First, let's check if we can connect to the database
    const connectionTest = await sql`SELECT 1 as test`
    console.log("Database connection test:", connectionTest)

    // Check if products table exists and has data
    const productCount = await sql`SELECT COUNT(*) as count FROM products WHERE status = 'active'`
    console.log("Active products count:", productCount)

    // Check table structure
    const tableStructure = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      ORDER BY ordinal_position
    `
    console.log("Products table structure:", tableStructure)

    // Get sample products
    const sampleProducts = await sql`
      SELECT 
        p.id,
        p.name,
        p.price,
        p.description,
        p.status,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'active'
      LIMIT 5
    `
    console.log("Sample products:", sampleProducts)

    // Test the actual search query
    const searchTerm = `%${query}%`
    const searchResults = await sql`
      SELECT 
        p.id,
        p.name,
        p.price::numeric as price,
        p.description,
        c.name as category_name,
        p.material,
        p.brand
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 
        p.status = 'active' AND
        (
          p.name ILIKE ${searchTerm} OR
          p.description ILIKE ${searchTerm} OR
          c.name ILIKE ${searchTerm} OR
          p.material ILIKE ${searchTerm} OR
          p.brand ILIKE ${searchTerm}
        )
      LIMIT 10
    `
    console.log("Search results:", searchResults)

    return NextResponse.json({
      success: true,
      debug: {
        query,
        connectionTest,
        productCount,
        tableStructure,
        sampleProducts,
        searchResults,
      },
    })
  } catch (error) {
    console.error("Debug Search API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Debug search failed",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
