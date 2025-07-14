import type { NextRequest } from "next/server"
import { sql } from "@/lib/db"

// GET /api/admin/products - List all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const status = searchParams.get("status") || ""

    const offset = (page - 1) * limit

    // Build WHERE clause
    const whereConditions = []
    const params = []
    let paramIndex = 1

    if (search) {
      whereConditions.push(`(p.name ILIKE $${paramIndex} OR p.sku ILIKE $${paramIndex})`)
      params.push(`%${search}%`)
      paramIndex++
    }

    if (category) {
      whereConditions.push(`p.category_id = $${paramIndex}`)
      params.push(Number.parseInt(category))
      paramIndex++
    }

    if (status) {
      whereConditions.push(`p.status = $${paramIndex}`)
      params.push(status)
      paramIndex++
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    // Get products with category names
    const productsQuery = `
      SELECT 
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    params.push(limit, offset)
    const products = await sql(productsQuery, params)

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `

    const countParams = params.slice(0, -2) // Remove limit and offset
    const totalResult = await sql(countQuery, countParams)
    const total = Number.parseInt(totalResult[0].total)

    return NextResponse.json({
      success: true,
      data: products,
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

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      name,
      description,
      short_description,
      sku,
      price,
      compare_price,
      cost,
      category_id,
      stock_quantity,
      track_quantity,
      continue_selling,
      weight,
      dimensions,
      material,
      color,
      brand,
      status,
      images,
      primary_image_index,
      tags,
      is_featured,
      is_trending,
      is_best_seller,
      is_hot_selling,
      is_deal_of_day,
      is_latest,
      room_type,
      meta_title,
      meta_description,
    } = body

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Validate required fields
    if (!name || !sku || !price) {
      return NextResponse.json({ success: false, error: "Name, SKU, and price are required" }, { status: 400 })
    }

    // Check if SKU already exists
    const existingSku = await sql`
      SELECT id FROM products WHERE sku = ${sku}
    `

    if (existingSku.length > 0) {
      return NextResponse.json({ success: false, error: "SKU already exists" }, { status: 400 })
    }

    // Insert product
    const result = await sql`
      INSERT INTO products (
        name, slug, description, short_description, sku, price, compare_price, cost,
        category_id, stock_quantity, track_quantity, continue_selling, weight,
        dimensions, material, color, brand, status, images, primary_image_index,
        tags, is_featured, is_trending, is_best_seller, is_hot_selling,
        is_deal_of_day, is_latest, room_type, meta_title, meta_description
      )
      VALUES (
        ${name}, ${slug}, ${description}, ${short_description}, ${sku}, 
        ${price}, ${compare_price || null}, ${cost || null}, ${category_id || null},
        ${stock_quantity || 0}, ${track_quantity !== false}, ${continue_selling === true},
        ${weight || null}, ${dimensions ? JSON.stringify(dimensions) : null},
        ${material || null}, ${color || null}, ${brand || null}, ${status || "active"},
        ${images ? JSON.stringify(images) : "[]"}, ${primary_image_index || 0},
        ${tags ? JSON.stringify(tags) : "[]"}, ${is_featured === true},
        ${is_trending === true}, ${is_best_seller === true}, ${is_hot_selling === true},
        ${is_deal_of_day === true}, ${is_latest === true}, ${room_type || null},
        ${meta_title || null}, ${meta_description || null}
      )
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      data: result[0],
    })
  } catch (error: any) {
    console.error("Error creating product:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
