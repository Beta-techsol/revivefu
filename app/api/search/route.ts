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
        success: true,
        results: [],
        message: "Query too short",
      })
    }

    console.log("Search API - Query:", query, "Limit:", limit)

    // Search products with fuzzy matching
    const searchQuery = `
      SELECT 
        p.id,
        p.name,
        p.price::numeric as price,
        p.images,
        c.name as category_name,
        p.stock_quantity
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'active'
        AND (
          p.name ILIKE '%' || $1 || '%' 
          OR p.description ILIKE '%' || $1 || '%'
          OR p.short_description ILIKE '%' || $1 || '%'
          OR c.name ILIKE '%' || $1 || '%'
          OR p.tags::text ILIKE '%' || $1 || '%'
          OR p.material ILIKE '%' || $1 || '%'
          OR p.color ILIKE '%' || $1 || '%'
          OR p.brand ILIKE '%' || $1 || '%'
        )
      ORDER BY 
        CASE 
          WHEN p.name ILIKE $1 || '%' THEN 1
          WHEN p.name ILIKE '%' || $1 || '%' THEN 2
          WHEN p.description ILIKE '%' || $1 || '%' THEN 3
          ELSE 4
        END,
        p.is_featured DESC,
        p.created_at DESC
      LIMIT $2
    `

    const results = await sql.unsafe(searchQuery, [query, limit])

    // Transform results
    const transformedResults = results.map((product: any) => {
      const getProductImages = (images: string | string[]) => {
        if (typeof images === "string") {
          try {
            const parsed = JSON.parse(images)
            return Array.isArray(parsed) ? parsed : [images]
          } catch {
            return [images]
          }
        }
        return Array.isArray(images) ? images : []
      }

      const productImages = getProductImages(product.images)

      return {
        id: product.id,
        name: product.name,
        price: Number.parseFloat(product.price) || 0,
        image: productImages.length > 0 ? productImages[0] : "/placeholder.svg?height=400&width=400",
        category: product.category_name || "Furniture",
        inStock: product.stock_quantity > 0,
      }
    })

    console.log("Search API - Results:", transformedResults.length)

    return NextResponse.json({
      success: true,
      results: transformedResults,
      total: transformedResults.length,
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Search failed",
        results: [],
      },
      { status: 500 },
    )
  }
}
