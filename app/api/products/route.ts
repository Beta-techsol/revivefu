import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "1000")
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

    const whereConditions = ["p.status = 'active'"]

    if (category && category !== "all") {
      whereConditions.push(`EXISTS (
        SELECT 1 FROM product_categories pc 
        JOIN categories cat ON pc.category_id = cat.id 
        WHERE pc.product_id = p.id AND cat.slug = '${category}'
      )`)
    }

    if (search) {
      whereConditions.push(`(p.name ILIKE '%${search}%' OR p.description ILIKE '%${search}%')`)
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
      whereConditions.push(`rt.slug = '${room_type}'`)
    }

    const whereClause = `WHERE ${whereConditions.join(" AND ")}`

    // Count query - Updated to work with junction table
    const countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      LEFT JOIN room_type rt ON p.room_type_id = rt.id
      ${whereClause}
    `
    console.log("Count query:", countQuery)
    const totalResult = await sql`${sql.unsafe(countQuery)}`
    const total = Number.parseInt(totalResult[0]?.total || "0")

    const productsQuery = `
      SELECT 
        p.id,
        p.slug,
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
        p.created_at,
        p.updated_at,
        rt.name as room_type_name,
        rt.slug as room_type_slug,
        rt.id as room_type_id,
        -- Get all categories for this product as JSON
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', c.id,
              'name', c.name,
              'slug', c.slug
            )
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'::json
        ) as categories
      FROM products p
      LEFT JOIN room_type rt ON p.room_type_id = rt.id
      LEFT JOIN product_categories pc ON p.id = pc.product_id
      LEFT JOIN categories c ON pc.category_id = c.id
      ${whereClause}
      GROUP BY p.id, rt.id, rt.name, rt.slug
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    console.log("Products query:", productsQuery)
    const products = await sql`${sql.unsafe(productsQuery)}`

    // Transform products
    const transformedProducts = products.map((product: any) => ({
      ...product,
      price: Number.parseFloat(product.price) || 0,
      compare_price: product.compare_price ? Number.parseFloat(product.compare_price) : null,
      average_rating: Number.parseFloat(product.average_rating) || 0,
      review_count: Number.parseInt(product.review_count) || 0,
      stock_quantity: Number.parseInt(product.stock_quantity) || 0,
      images: typeof product.images === "string" ? product.images : JSON.stringify(product.images || []),
      tags: typeof product.tags === "string" ? product.tags : JSON.stringify(product.tags || []),
      categories: Array.isArray(product.categories) ? product.categories : [],
      // Backward compatibility - use first category as primary
      category_name:
        Array.isArray(product.categories) && product.categories.length > 0 ? product.categories[0].name : null,
      category_slug:
        Array.isArray(product.categories) && product.categories.length > 0 ? product.categories[0].slug : null,
      category_id: Array.isArray(product.categories) && product.categories.length > 0 ? product.categories[0].id : null,
      // compatibility
      room_type: product.room_type_name,
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
