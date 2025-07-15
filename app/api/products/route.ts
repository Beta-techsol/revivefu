import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""

    const offset = (page - 1) * limit

    // Build WHERE clause
    let whereClause = "WHERE p.status = 'active'"
    const params: any[] = []
    let paramIndex = 1

    if (search) {
      whereClause += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    if (category && category !== "all") {
      whereClause += ` AND c.slug = $${paramIndex}`
      params.push(category)
      paramIndex++
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `

    const countResult = await sql(countQuery, params)
    const total = Number.parseInt(countResult[0]?.total || "0")

    // Get products with pagination
    const productsQuery = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    params.push(limit, offset)
    const products = await sql(productsQuery, params)

    // Calculate pagination info
    const pages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      products: products,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
        products: [],
      },
      { status: 500 },
    )
  }
}
