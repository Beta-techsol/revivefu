import type { NextRequest } from "next/server"
import { sql } from "@/lib/db"

// GET /api/products - Public product API for frontend
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured") === "true"
    const trending = searchParams.get("trending") === "true"
    const best_seller = searchParams.get("best_seller") === "true"
    const hot_selling = searchParams.get("hot_selling") === "true"
    const deal_of_day = searchParams.get("deal_of_day") === "true"
    const latest = searchParams.get("latest") === "true"
    const room_type = searchParams.get("room_type")
    const offset = (page - 1) * limit

    const whereConditions = ["p.status = 'active'"]
    const queryParams: any[] = []

    if (category && category !== "all") {
      whereConditions.push("c.slug = $" + (queryParams.length + 1))
      queryParams.push(category)
    }

    if (search) {
      whereConditions.push(
        "(p.name ILIKE $" +
          (queryParams.length + 1) +
          " OR p.description ILIKE $" +
          (queryParams.length + 2) +
          " OR p.brand ILIKE $" +
          (queryParams.length + 3) +
          ")",
      )
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`)
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

    if (hot_selling) {
      whereConditions.push("p.is_hot_selling = true")
    }

    if (deal_of_day) {
      whereConditions.push("p.is_deal_of_day = true")
    }

    if (latest) {
      whereConditions.push("p.is_latest = true")
    }

    if (room_type) {
      whereConditions.push("p.room_type = $" + (queryParams.length + 1))
      queryParams.push(room_type)
    }

    const whereClause = whereConditions.join(" AND ")

    // Add limit and offset to params
    queryParams.push(limit, offset)

    const products = await sql`
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE ${sql.unsafe(whereClause)}
      ORDER BY p.created_at DESC 
      LIMIT ${sql.unsafe("$" + (queryParams.length - 1))} 
      OFFSET ${sql.unsafe("$" + queryParams.length)}
    `.values(queryParams)

    // Get total count for pagination
    const countParams = queryParams.slice(0, -2) // Remove limit and offset
    const [{ count: total }] = await sql`
      SELECT COUNT(*) as count
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE ${sql.unsafe(whereClause)}
    `.values(countParams)

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
