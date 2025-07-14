import type { NextRequest } from "next/server"
import { sql } from "@/lib/db"

// GET /api/products - Public products API for frontend
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const room_type = searchParams.get("room_type")
    const featured = searchParams.get("featured")
    const trending = searchParams.get("trending")
    const best_seller = searchParams.get("best_seller")
    const hot_selling = searchParams.get("hot_selling")
    const deal_of_day = searchParams.get("deal_of_day")
    const latest = searchParams.get("latest")
    const sort = searchParams.get("sort") || "created_at"
    const order = searchParams.get("order") || "desc"
    const offset = (page - 1) * limit

    const whereConditions = ["p.status = 'active'"]
    const queryParams: any[] = []
    let paramIndex = 1

    if (category && category !== "all") {
      whereConditions.push(`c.slug = $${paramIndex}`)
      queryParams.push(category)
      paramIndex++
    }

    if (room_type) {
      whereConditions.push(`p.room_type = $${paramIndex}`)
      queryParams.push(room_type)
      paramIndex++
    }

    if (search) {
      whereConditions.push(
        `(p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex + 1} OR p.brand ILIKE $${paramIndex + 2})`,
      )
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`)
      paramIndex += 3
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

    if (hot_selling === "true") {
      whereConditions.push("p.is_hot_selling = true")
    }

    if (deal_of_day === "true") {
      whereConditions.push("p.is_deal_of_day = true")
    }

    if (latest === "true") {
      whereConditions.push("p.is_latest = true")
    }

    const whereClause = whereConditions.join(" AND ")
    const orderClause = `p.${sort} ${order.toUpperCase()}`

    const products = await sql`
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.description,
        p.short_description,
        p.sku,
        p.price,
        p.compare_price,
        p.stock_quantity,
        p.material,
        p.color,
        p.brand,
        p.images,
        p.tags,
        p.is_featured,
        p.is_trending,
        p.is_best_seller,
        p.is_hot_selling,
        p.is_deal_of_day,
        p.is_latest,
        p.room_type,
        p.average_rating,
        p.review_count,
        p.created_at,
        c.name as category_name,
        c.slug as category_slug
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE ${sql.unsafe(whereClause)}
      ORDER BY ${sql.unsafe(orderClause)}
      LIMIT ${limit} OFFSET ${offset}
    `.values(queryParams)

    // Get total count for pagination
    const [{ count: total }] = await sql`
      SELECT COUNT(*) as count
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE ${sql.unsafe(whereClause)}
    `.values(queryParams)

    return Response.json({
      products,
      pagination: {
        page,
        limit,
        total: Number(total),
        pages: Math.ceil(Number(total) / limit),
      },
    })
  } catch (error) {
    console.error("Products fetch error:", error)
    return Response.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
