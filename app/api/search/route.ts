import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    console.log("Search API - Query:", query, "Limit:", limit)

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: true,
        products: [],
        suggestions: [],
        query: query || "",
      })
    }

    const searchTerm = query.trim()
    console.log("Search API - Processing search term:", searchTerm)

    // Test database connection first
    try {
      await sql`SELECT 1`
      console.log("Database connection successful")
    } catch (dbError) {
      console.error("Database connection failed:", dbError)
      throw new Error("Database connection failed")
    }

    // Search products with comprehensive matching
    const searchPattern = `%${searchTerm}%`

    console.log("Executing search query with pattern:", searchPattern)

    const products = await sql`
      SELECT 
        p.id,
        p.slug,
        p.name,
        p.price::numeric as price,
        p.compare_price::numeric as compare_price,
        p.description,
        p.short_description,
        p.sku,
        p.stock_quantity,
        p.images,
        p.material,
        p.color,
        p.brand,
        COALESCE(p.average_rating::numeric, 0) as average_rating,
        COALESCE(p.review_count, 0) as review_count,
        p.is_featured,
        p.is_trending,
        p.is_best_seller,
        COALESCE(c.name, '') as category_name,
        COALESCE(c.slug, '') as category_slug,
        COALESCE(rt.name, '') as room_type_name,
        COALESCE(rt.slug, '') as room_type_slug,
        -- Calculate relevance score
        (
          CASE WHEN p.name ILIKE ${`%${searchTerm}%`} THEN 100 ELSE 0 END +
          CASE WHEN p.description ILIKE ${`%${searchTerm}%`} THEN 60 ELSE 0 END +
          CASE WHEN p.short_description ILIKE ${`%${searchTerm}%`} THEN 50 ELSE 0 END +
          CASE WHEN c.name ILIKE ${`%${searchTerm}%`} THEN 40 ELSE 0 END +
          CASE WHEN p.material ILIKE ${`%${searchTerm}%`} THEN 30 ELSE 0 END +
          CASE WHEN p.color ILIKE ${`%${searchTerm}%`} THEN 25 ELSE 0 END +
          CASE WHEN p.brand ILIKE ${`%${searchTerm}%`} THEN 35 ELSE 0 END +
          CASE WHEN rt.name ILIKE ${`%${searchTerm}%`} THEN 45 ELSE 0 END
        ) as relevance_score
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN room_type rt ON p.room_type_id = rt.id
      WHERE 
        p.status = 'active' AND
        (
          p.name ILIKE ${`%${searchTerm}%`} OR
          p.description ILIKE ${`%${searchTerm}%`} OR
          p.short_description ILIKE ${`%${searchTerm}%`} OR
          c.name ILIKE ${`%${searchTerm}%`} OR
          p.material ILIKE ${`%${searchTerm}%`} OR
          p.color ILIKE ${`%${searchTerm}%`} OR
          p.brand ILIKE ${`%${searchTerm}%`} OR
          rt.name ILIKE ${`%${searchTerm}%`} OR
          p.sku ILIKE ${`%${searchTerm}%`}
        )
      ORDER BY relevance_score DESC, p.is_featured DESC, p.average_rating DESC
      LIMIT ${limit}
    `

    console.log("Search query executed, found products:", products.length)

    // Get search suggestions
    const suggestions = await sql`
      SELECT DISTINCT
        'category' as type,
        c.name as value,
        c.slug as slug,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
      WHERE c.name ILIKE ${`%${searchTerm}%`}
      GROUP BY c.id, c.name, c.slug
      HAVING COUNT(p.id) > 0
      
      UNION ALL
      
      SELECT DISTINCT
        'brand' as type,
        p.brand as value,
        p.brand as slug,
        COUNT(*) as product_count
      FROM products p
      WHERE p.status = 'active' AND p.brand ILIKE ${`%${searchTerm}%`} AND p.brand IS NOT NULL AND p.brand != ''
      GROUP BY p.brand
      
      UNION ALL
      
      SELECT DISTINCT
        'material' as type,
        p.material as value,
        p.material as slug,
        COUNT(*) as product_count
      FROM products p
      WHERE p.status = 'active' AND p.material ILIKE ${`%${searchTerm}%`} AND p.material IS NOT NULL AND p.material != ''
      GROUP BY p.material
      
      UNION ALL
      
      SELECT DISTINCT
        'room_type' as type,
        rt.name as value,
        rt.slug as slug,
        COUNT(p.id) as product_count
      FROM room_type rt
      LEFT JOIN products p ON rt.id = p.room_type_id AND p.status = 'active'
      WHERE rt.name ILIKE ${`%${searchTerm}%`}
      GROUP BY rt.id, rt.name, rt.slug
      HAVING COUNT(p.id) > 0
      
      ORDER BY product_count DESC
      LIMIT 5
    `

    console.log("Suggestions query executed, found:", suggestions.length)

    // Transform products
    const transformedProducts = products.map((product: any) => ({
      ...product,
      price: Number.parseFloat(product.price) || 0,
      compare_price: product.compare_price ? Number.parseFloat(product.compare_price) : null,
      average_rating: Number.parseFloat(product.average_rating) || 0,
      review_count: Number.parseInt(product.review_count) || 0,
      stock_quantity: Number.parseInt(product.stock_quantity) || 0,
      images: typeof product.images === "string" ? product.images : JSON.stringify(product.images || []),
      relevance_score: Number.parseInt(product.relevance_score) || 0,
    }))

    console.log("Search API - Final results:", {
      query: searchTerm,
      productsFound: transformedProducts.length,
      suggestionsFound: suggestions.length,
    })

    return NextResponse.json({
      success: true,
      products: transformedProducts,
      suggestions: suggestions,
      query: searchTerm,
    })
  } catch (error) {
    console.error("Error in search API:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Search failed",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
