import type { NextRequest } from "next/server"
import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const featured = searchParams.get("featured") === "true"
    const trending = searchParams.get("trending") === "true"
    const best_seller = searchParams.get("best_seller") === "true"
    const room_type = searchParams.get("room_type") || ""

    const offset = (page - 1) * limit

    console.log("Fetching public products with params:", {
      page,
      limit,
      search,
      category,
      featured,
      trending,
      best_seller,
      room_type,
    })

    // Build WHERE conditions
    const whereConditions = ["p.status = 'active'"]
    const queryValues = []

    if (search) {
      whereConditions.push(
        `(p.name ILIKE '%' || $${queryValues.length + 1} || '%' OR p.description ILIKE '%' || $${queryValues.length + 1} || '%')`,
      )
      queryValues.push(search)
    }

    if (category && category !== "all") {
      whereConditions.push(`c.slug = $${queryValues.length + 1}`)
      queryValues.push(category)
    }

    if (featured) {
      whereConditions.push("p.is_featured = true")
    }

    if (trending) {
      whereConditions.push("p.is_trending = true")
    }

    if (best_seller) {
      whereConditions.push("p.is_best_seller = true")
    }

    if (room_type) {
      whereConditions.push(`p.room_type = $${queryValues.length + 1}`)
      queryValues.push(room_type)
    }

    const whereClause = `WHERE ${whereConditions.join(" AND ")}`

    // Get products with category names
    const productsQuery = `
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.description,
        p.short_description,
        p.sku,
        p.price,
        p.compare_price,
        p.cost,
        p.category_id,
        p.stock_quantity,
        p.track_quantity,
        p.continue_selling,
        p.weight,
        p.dimensions,
        p.material,
        p.color,
        p.brand,
        p.status,
        p.images,
        p.primary_image_index,
        p.tags,
        p.is_featured,
        p.is_trending,
        p.is_best_seller,
        p.is_hot_selling,
        p.is_deal_of_day,
        p.is_latest,
        p.room_type,
        p.meta_title,
        p.meta_description,
        p.average_rating,
        p.review_count,
        p.created_at,
        p.updated_at,
        COALESCE(c.name, 'Uncategorized') as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${queryValues.length + 1} OFFSET $${queryValues.length + 2}
    `

    queryValues.push(limit, offset)

    console.log("Executing public products query:", productsQuery)
    console.log("With values:", queryValues)

    const products = await sql(productsQuery, queryValues)

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `

    const countValues = queryValues.slice(0, -2) // Remove limit and offset
    console.log("Executing public count query:", countQuery)
    console.log("With values:", countValues)

    const totalResult = await sql(countQuery, countValues)
    const total = Number.parseInt(totalResult[0]?.total || "0")

    console.log("Found public products:", products.length)
    console.log("Total public count:", total)

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Error fetching public products:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
