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

    // Build WHERE clause
    const whereConditions = ["p.status = 'active'"]
    const params = []

    if (search) {
      whereConditions.push(`(p.name ILIKE $${params.length + 1} OR p.description ILIKE $${params.length + 1})`)
      params.push(`%${search}%`)
    }

    if (category) {
      whereConditions.push(`c.slug = $${params.length + 1}`)
      params.push(category)
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
      whereConditions.push(`p.room_type = $${params.length + 1}`)
      params.push(room_type)
    }

    const whereClause = `WHERE ${whereConditions.join(" AND ")}`

    // Get products with category names
    const productsQuery = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `

    params.push(limit, offset)
    const products = await sql.unsafe(productsQuery, params)

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `

    const countParams = params.slice(0, -2) // Remove limit and offset
    const totalResult = await sql.unsafe(countQuery, countParams)
    const total = Number.parseInt(totalResult[0].total)

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
    console.error("Error fetching products:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
