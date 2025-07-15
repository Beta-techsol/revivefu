import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")
    const trending = searchParams.get("trending")
    const best_seller = searchParams.get("best_seller")
    const room_type = searchParams.get("room_type")

    const offset = (page - 1) * limit

    console.log("Public Products API - Query params:", {
      page,
      limit,
      category,
      search,
      featured,
      trending,
      best_seller,
      room_type,
      offset,
    })

    const whereConditions = ["p.status = 'active'"] // Only show active products to public

    // Build WHERE conditions
    if (category && category !== "all") {
      whereConditions.push(`c.slug = $${whereConditions.length + 1}`)
    }

    if (search) {
      whereConditions.push(
        `(p.name ILIKE $${whereConditions.length + 1} OR p.description ILIKE $${whereConditions.length + 1})`,
      )
    }

    if (featured === "true") {
      whereConditions.push("p.is_featured = true")
    }

    if (trending === "true") {
      whereConditions.push("p.is_trending = true")
    }

    if (best_seller === "true") {
      whereConditions.push("p.is_best_seller = true")
    }

    if (room_type) {
      whereConditions.push(`rt.name = $${whereConditions.length + 1}`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    // Get total count with proper parameterized query
    const countParams = []
    let paramIndex = 1

    if (category && category !== "all") {
      countParams.push(category)
      paramIndex++
    }
    if (search) {
      countParams.push(`%${search}%`)
      countParams.push(`%${search}%`)
      paramIndex += 2
    }
    if (room_type) {
      countParams.push(room_type)
      paramIndex++
    }

    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN room_types rt ON p.room_type_id = rt.id
      ${whereClause}
    `

    console.log("Count query:", countQuery)
    const totalResult = await sql(countQuery, ...countParams)
    const total = Number.parseInt(totalResult[0]?.total || "0")

    // Get products with pagination using the same parameters
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
      ORDER BY p.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    const queryParams = [...countParams, limit, offset]
    console.log("Products query:", productsQuery)
    console.log("Query params:", queryParams)

    const products = await sql(productsQuery, ...queryParams)

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

    const pages = Math.ceil(total / limit)

    console.log("Public Products API - Results:", {
      total,
      pages,
      currentPage: page,
      productsCount: transformedProducts.length,
    })

    return NextResponse.json({
      success: true,
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    })
  } catch (error) {
    console.error("Error in public products API:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch products",
      },
      { status: 500 },
    )
  }
}
