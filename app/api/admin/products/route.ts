import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""

    const offset = (page - 1) * limit

    // Build WHERE clause
    let whereClause = "WHERE 1=1"
    const params: any[] = []
    let paramIndex = 1

    if (search) {
      whereClause += ` AND (p.name ILIKE $${paramIndex} OR p.sku ILIKE $${paramIndex} OR p.tags::text ILIKE $${paramIndex})`
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
      data: products,
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
    console.error("Error fetching admin products:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
        data: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          pages: 0,
          hasNext: false,
          hasPrev: false,
        },
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      short_description,
      price,
      compare_price,
      sku,
      category_id,
      stock_quantity,
      images,
      tags,
      material,
      color,
      brand,
      room_type,
      is_featured,
      is_trending,
      is_best_seller,
      is_hot_selling,
      is_deal_of_day,
      is_latest,
      status = "active",
    } = body

    // Validate required fields
    if (!name || !price || !category_id) {
      return NextResponse.json({ success: false, error: "Name, price, and category are required" }, { status: 400 })
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Insert product
    const result = await sql`
      INSERT INTO products (
        name, slug, description, short_description, price, compare_price, sku,
        category_id, stock_quantity, images, tags, material, color, brand,
        room_type, is_featured, is_trending, is_best_seller, is_hot_selling,
        is_deal_of_day, is_latest, status, created_at, updated_at
      ) VALUES (
        ${name}, ${slug}, ${description}, ${short_description}, ${price}, ${compare_price}, ${sku},
        ${category_id}, ${stock_quantity}, ${JSON.stringify(images)}, ${JSON.stringify(tags)}, 
        ${material}, ${color}, ${brand}, ${room_type}, ${is_featured}, ${is_trending}, 
        ${is_best_seller}, ${is_hot_selling}, ${is_deal_of_day}, ${is_latest}, ${status},
        NOW(), NOW()
      ) RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Product created successfully",
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 })
  }
}
