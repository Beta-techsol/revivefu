import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tab = searchParams.get("tab") || "deals"
    const limit = Number.parseInt(searchParams.get("limit") || "25")

    console.log("Random Products API - Query params:", { tab, limit })

    // Build WHERE conditions based on tab
    const whereConditions = ["p.status = 'active'"]

    switch (tab) {
      case "deals":
        whereConditions.push("(p.is_deal_of_day = true OR p.compare_price IS NOT NULL)")
        break
      case "latest":
        whereConditions.push("p.is_latest = true")
        break
      case "trending":
        whereConditions.push("p.is_trending = true")
        break
      case "hot":
        whereConditions.push("p.is_hot_selling = true")
        break
      case "featured":
        whereConditions.push("p.is_featured = true")
        break
      case "bestseller":
        whereConditions.push("p.is_best_seller = true")
        break
      default:
        // For any other tab, just get active products
        break
    }

    const whereClause = `WHERE ${whereConditions.join(" AND ")}`

    const productsQuery = `
      SELECT 
        p.id,
        p.name,
        p.price::numeric as price,
        p.compare_price::numeric as compare_price,
        p.description,
        p.short_description,
        p.sku,
        p.status,
        p.stock_quantity,
        p.images,
        p.tags,
        p.material,
        p.color,
        p.brand,
        p.average_rating::numeric as average_rating,
        p.review_count,
        p.is_featured,
        p.is_trending,
        p.is_best_seller,
        p.is_hot_selling,
        p.is_deal_of_day,
        p.is_latest,
        p.room_type_id,
        COALESCE(rt.name, '') as room_type,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN room_types rt ON p.room_type_id = rt.id
      ${whereClause}
      ORDER BY RANDOM()
      LIMIT $1
    `

    console.log("Random Products query:", productsQuery)
    const products = await sql(productsQuery, limit)

    // Transform products to ensure proper data types
    const transformedProducts = products.map((product: any) => ({
      ...product,
      price: Number.parseFloat(product.price) || 0,
      compare_price: product.compare_price ? Number.parseFloat(product.compare_price) : null,
      average_rating: Number.parseFloat(product.average_rating) || 0,
      review_count: Number.parseInt(product.review_count) || 0,
      stock_quantity: Number.parseInt(product.stock_quantity) || 0,
      images: typeof product.images === "string" ? JSON.parse(product.images || "[]") : product.images || [],
      tags: typeof product.tags === "string" ? JSON.parse(product.tags || "[]") : product.tags || [],
    }))

    console.log("Random Products API - Results:", {
      tab,
      productsCount: transformedProducts.length,
    })

    return NextResponse.json({
      success: true,
      products: transformedProducts,
    })
  } catch (error) {
    console.error("Error in random products API:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch products",
      },
      { status: 500 },
    )
  }
}
