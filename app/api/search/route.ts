import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ products: [] })
    }

    const searchTerm = `%${query.trim().toLowerCase()}%`

    // Search products by name, description, category, brand, material, color
    const products = await sql`
      SELECT 
        p.id,
        p.name,
        p.price,
        p.compare_price,
        p.images,
        p.short_description,
        p.stock_quantity,
        p.average_rating,
        p.review_count,
        p.is_featured,
        p.is_trending,
        p.is_best_seller,
        p.is_hot_selling,
        p.is_deal_of_day,
        p.is_latest,
        c.name as category_name,
        p.brand,
        p.material,
        p.color,
        rt.name as room_type
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN room_type rt ON p.room_type_id = rt.id
      WHERE 
        p.is_active = true
        AND (
          LOWER(p.name) LIKE ${searchTerm}
          OR LOWER(p.description) LIKE ${searchTerm}
          OR LOWER(p.short_description) LIKE ${searchTerm}
          OR LOWER(c.name) LIKE ${searchTerm}
          OR LOWER(p.brand) LIKE ${searchTerm}
          OR LOWER(p.material) LIKE ${searchTerm}
          OR LOWER(p.color) LIKE ${searchTerm}
          OR LOWER(rt.name) LIKE ${searchTerm}
        )
      ORDER BY 
        CASE 
          WHEN LOWER(p.name) LIKE ${`${query.trim().toLowerCase()}%`} THEN 1
          WHEN LOWER(p.name) LIKE ${searchTerm} THEN 2
          WHEN LOWER(p.description) LIKE ${searchTerm} THEN 3
          ELSE 4
        END,
        p.average_rating DESC,
        p.review_count DESC
      LIMIT ${limit}
    `

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      {
        error: "Search failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
