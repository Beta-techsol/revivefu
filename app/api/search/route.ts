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
        p.price::numeric AS price,
        p.compare_price::numeric AS compare_price,
        p.description,
        p.short_description,
        p.sku,
        p.stock_quantity,
        p.images,
        p.material,
        p.color,
        p.brand,
        COALESCE(p.average_rating::numeric, 0) AS average_rating,
        COALESCE(p.review_count, 0) AS review_count,
        p.is_featured,
        p.is_trending,
        p.is_best_seller,
        rt.name AS room_type_name,
        rt.slug AS room_type_slug,
        COALESCE(
          JSON_AGG(
            DISTINCT JSON_BUILD_OBJECT(
              'id', c.id,
              'name', c.name,
              'slug', c.slug
            )
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'::json
        ) AS categories,
        (
          CASE WHEN p.name ILIKE ${"%" + searchTerm + "%"} THEN 100 ELSE 0 END +
          CASE WHEN p.description ILIKE ${"%" + searchTerm + "%"} THEN 60 ELSE 0 END +
          CASE WHEN p.short_description ILIKE ${"%" + searchTerm + "%"} THEN 50 ELSE 0 END +
          COALESCE(MAX(CASE WHEN c.name ILIKE ${"%" + searchTerm + "%"} THEN 40 ELSE 0 END), 0) +
          CASE WHEN p.material ILIKE ${"%" + searchTerm + "%"} THEN 30 ELSE 0 END +
          CASE WHEN p.color ILIKE ${"%" + searchTerm + "%"} THEN 25 ELSE 0 END +
          CASE WHEN p.brand ILIKE ${"%" + searchTerm + "%"} THEN 35 ELSE 0 END +
          CASE WHEN rt.name ILIKE ${"%" + searchTerm + "%"} THEN 45 ELSE 0 END
        ) AS relevance_score
      FROM products p
      LEFT JOIN room_type rt ON p.room_type_id = rt.id
      LEFT JOIN product_categories pc ON pc.product_id = p.id
      LEFT JOIN categories c ON c.id = pc.category_id
      WHERE 
        p.status = 'active' AND (
          p.name ILIKE ${"%" + searchTerm + "%"} OR
          p.description ILIKE ${"%" + searchTerm + "%"} OR
          p.short_description ILIKE ${"%" + searchTerm + "%"} OR
          p.material ILIKE ${"%" + searchTerm + "%"} OR
          p.color ILIKE ${"%" + searchTerm + "%"} OR
          p.brand ILIKE ${"%" + searchTerm + "%"} OR
          rt.name ILIKE ${"%" + searchTerm + "%"} OR
          p.sku ILIKE ${"%" + searchTerm + "%"} OR
          c.name ILIKE ${"%" + searchTerm + "%"}
        )
      GROUP BY p.id, rt.id, rt.name, rt.slug
      ORDER BY relevance_score DESC, p.is_featured DESC, p.average_rating DESC
      LIMIT ${limit}
    `

    console.log("Search query executed, found products:", products.length)

    // Get search suggestions
    const suggestions = await sql`
      SELECT DISTINCT
        'category' AS type,
        c.name AS value,
        c.slug AS slug,
        COUNT(DISTINCT p.id) AS product_count
      FROM categories c
      JOIN product_categories pc ON pc.category_id = c.id
      JOIN products p ON p.id = pc.product_id AND p.status = 'active'
      WHERE c.name ILIKE ${"%" + searchTerm + "%"}
      GROUP BY c.id, c.name, c.slug
      
      UNION ALL
      
      SELECT DISTINCT
        'brand' AS type,
        p.brand AS value,
        p.brand AS slug,
        COUNT(*) AS product_count
      FROM products p
      WHERE p.status = 'active' AND p.brand ILIKE ${"%" + searchTerm + "%"} AND p.brand IS NOT NULL AND p.brand != ''
      GROUP BY p.brand
      
      UNION ALL
      
      SELECT DISTINCT
        'material' AS type,
        p.material AS value,
        p.material AS slug,
        COUNT(*) AS product_count
      FROM products p
      WHERE p.status = 'active' AND p.material ILIKE ${"%" + searchTerm + "%"} AND p.material IS NOT NULL AND p.material != ''
      GROUP BY p.material
      
      UNION ALL
      
      SELECT DISTINCT
        'room_type' AS type,
        rt.name AS value,
        rt.slug AS slug,
        COUNT(p.id) AS product_count
      FROM room_type rt
      LEFT JOIN products p ON rt.id = p.room_type_id AND p.status = 'active'
      WHERE rt.name ILIKE ${"%" + searchTerm + "%"}
      GROUP BY rt.id, rt.name, rt.slug
      
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
      categories: Array.isArray(product.categories) ? product.categories : [],
      // optional single-name fallback for UI chips that expect one
      category_name:
        Array.isArray(product.categories) && product.categories.length > 0 ? product.categories[0].name : "",
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
