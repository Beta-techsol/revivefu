import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: false,
        error: "Query must be at least 2 characters long",
      })
    }

    const searchTerm = `%${query.toLowerCase()}%`

    // Search products with relevance scoring
    const searchQuery = `
      SELECT 
        p.id,
        p.name,
        p.price::numeric as price,
        p.compare_price::numeric as compare_price,
        p.images,
        p.material,
        p.color,
        p.brand,
        p.stock_quantity,
        p.is_featured,
        p.is_trending,
        p.is_best_seller,
        p.average_rating::numeric as average_rating,
        p.review_count,
        c.name as category_name,
        rt.name as room_type_name,
        (
          CASE 
            WHEN LOWER(p.name) LIKE $1 THEN 100
            WHEN LOWER(p.name) LIKE $2 THEN 90
            WHEN LOWER(p.description) LIKE $1 THEN 80
            WHEN LOWER(c.name) LIKE $1 THEN 70
            WHEN LOWER(p.material) LIKE $1 THEN 60
            WHEN LOWER(p.brand) LIKE $1 THEN 50
            ELSE 40
          END
        ) as relevance_score
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN room_types rt ON p.room_type_id = rt.id
      WHERE p.status = 'active'
        AND (
          LOWER(p.name) LIKE $1
          OR LOWER(p.description) LIKE $1
          OR LOWER(c.name) LIKE $1
          OR LOWER(p.material) LIKE $1
          OR LOWER(p.color) LIKE $1
          OR LOWER(p.brand) LIKE $1
          OR LOWER(rt.name) LIKE $1
        )
      ORDER BY relevance_score DESC, p.is_featured DESC, p.average_rating DESC
      LIMIT $3
    `

    const products = await sql(searchQuery, [searchTerm, `${query.toLowerCase()}%`, limit])

    // Get suggestions for categories, brands, materials, room types
    const suggestionsQuery = `
      SELECT 'category' as type, c.name as value, c.slug, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
      WHERE LOWER(c.name) LIKE $1
      GROUP BY c.id, c.name, c.slug
      HAVING COUNT(p.id) > 0
      
      UNION ALL
      
      SELECT 'brand' as type, p.brand as value, p.brand as slug, COUNT(*) as product_count
      FROM products p
      WHERE p.status = 'active' AND p.brand IS NOT NULL AND LOWER(p.brand) LIKE $1
      GROUP BY p.brand
      
      UNION ALL
      
      SELECT 'material' as type, p.material as value, p.material as slug, COUNT(*) as product_count
      FROM products p
      WHERE p.status = 'active' AND p.material IS NOT NULL AND LOWER(p.material) LIKE $1
      GROUP BY p.material
      
      UNION ALL
      
      SELECT 'room' as type, rt.name as value, rt.slug, COUNT(p.id) as product_count
      FROM room_types rt
      LEFT JOIN products p ON rt.id = p.room_type_id AND p.status = 'active'
      WHERE LOWER(rt.name) LIKE $1
      GROUP BY rt.id, rt.name, rt.slug
      HAVING COUNT(p.id) > 0
      
      ORDER BY product_count DESC
      LIMIT 6
    `

    const suggestions = await sql(suggestionsQuery, [searchTerm])

    return NextResponse.json({
      success: true,
      products,
      suggestions,
      query,
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
