import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    console.log("Search API called with query:", query, "limit:", limit)

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: false,
        error: "Query must be at least 2 characters long",
      })
    }

    const searchTerm = `%${query.toLowerCase()}%`
    console.log("Search term:", searchTerm)

    // Search products with proper SQL syntax
    const productsQuery = `
      SELECT 
        p.id,
        p.name,
        p.price,
        p.compare_price,
        p.images,
        p.material,
        p.color,
        p.brand,
        p.average_rating,
        p.review_count,
        p.stock_quantity,
        p.is_featured,
        p.is_trending,
        p.is_best_seller,
        c.name as category_name,
        rt.name as room_type_name,
        CASE 
          WHEN LOWER(p.name) LIKE $1 THEN 100
          WHEN LOWER(p.brand) LIKE $1 THEN 90
          WHEN LOWER(c.name) LIKE $1 THEN 80
          WHEN LOWER(p.material) LIKE $1 THEN 70
          WHEN LOWER(p.color) LIKE $1 THEN 60
          WHEN LOWER(rt.name) LIKE $1 THEN 50
          ELSE 10
        END as relevance_score
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN room_types rt ON p.room_type_id = rt.id
      WHERE 
        p.status = 'active' AND (
          LOWER(p.name) LIKE $1 OR
          LOWER(p.brand) LIKE $1 OR
          LOWER(c.name) LIKE $1 OR
          LOWER(p.material) LIKE $1 OR
          LOWER(p.color) LIKE $1 OR
          LOWER(rt.name) LIKE $1
        )
      ORDER BY relevance_score DESC, p.is_featured DESC, p.average_rating DESC
      LIMIT $2
    `

    console.log("Executing products query...")
    const products = await sql(productsQuery, [searchTerm, limit])
    console.log("Products found:", products.length)

    // Search suggestions
    const suggestionsQuery = `
      SELECT DISTINCT 
        'category' as type,
        c.name as value,
        c.slug,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
      WHERE LOWER(c.name) LIKE $1
      GROUP BY c.id, c.name, c.slug
      HAVING COUNT(p.id) > 0
      
      UNION ALL
      
      SELECT DISTINCT 
        'brand' as type,
        p.brand as value,
        LOWER(REPLACE(p.brand, ' ', '-')) as slug,
        COUNT(*) as product_count
      FROM products p
      WHERE p.status = 'active' AND LOWER(p.brand) LIKE $1 AND p.brand IS NOT NULL AND p.brand != ''
      GROUP BY p.brand
      
      UNION ALL
      
      SELECT DISTINCT 
        'room' as type,
        rt.name as value,
        rt.slug,
        COUNT(p.id) as product_count
      FROM room_types rt
      LEFT JOIN products p ON rt.id = p.room_type_id AND p.status = 'active'
      WHERE LOWER(rt.name) LIKE $1
      GROUP BY rt.id, rt.name, rt.slug
      HAVING COUNT(p.id) > 0
      
      ORDER BY product_count DESC
      LIMIT 6
    `

    console.log("Executing suggestions query...")
    const suggestions = await sql(suggestionsQuery, [searchTerm])
    console.log("Suggestions found:", suggestions.length)

    const response = {
      success: true,
      products: products || [],
      suggestions: suggestions || [],
      query: query.trim(),
      total: products?.length || 0,
    }

    console.log("Search API response:", {
      success: response.success,
      productsCount: response.products.length,
      suggestionsCount: response.suggestions.length,
      query: response.query,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        products: [],
        suggestions: [],
        query: "",
        total: 0,
      },
      { status: 500 },
    )
  }
}
