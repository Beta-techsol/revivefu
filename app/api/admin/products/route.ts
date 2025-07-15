import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyAuth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const status = searchParams.get("status")

    const offset = (page - 1) * limit

    console.log("Admin Products API - Query params:", {
      page,
      limit,
      search,
      category,
      status,
      offset,
    })

    const whereConditions = []

    // Build WHERE conditions
    if (search) {
      whereConditions.push(`(p.name ILIKE '%${search}%' OR p.sku ILIKE '%${search}%')`)
    }

    if (category && category !== "all") {
      whereConditions.push(`c.slug = '${category}'`)
    }

    if (status && status !== "all") {
      whereConditions.push(`p.status = '${status}'`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN room_type rt ON p.room_type_id = rt.id
      ${whereClause}
    `

    console.log("Admin Count query:", countQuery)
    const totalResult = await sql`${sql.unsafe(countQuery)}`
    const total = Number.parseInt(totalResult[0]?.total || "0")

    // Get products with pagination
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
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.slug as category_slug,
        c.id as category_id,
        rt.name as room_type_name,
        rt.slug as room_type_slug,
        rt.id as room_type_id
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN room_type rt ON p.room_type_id = rt.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    console.log("Admin Products query:", productsQuery)
    const products = await sql`${sql.unsafe(productsQuery)}`

    // Transform products to ensure proper data types
    const transformedProducts = products.map((product: any) => ({
      ...product,
      price: Number.parseFloat(product.price) || 0,
      compare_price: product.compare_price ? Number.parseFloat(product.compare_price) : null,
      average_rating: Number.parseFloat(product.average_rating) || 0,
      review_count: Number.parseInt(product.review_count) || 0,
      stock_quantity: Number.parseInt(product.stock_quantity) || 0,
      images: typeof product.images === "string" ? product.images : JSON.stringify(product.images || []),
      tags: typeof product.tags === "string" ? product.tags : JSON.stringify(product.tags || []),
    }))

    const pages = Math.ceil(total / limit)

    console.log("Admin Products API - Results:", {
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
    console.error("Error in admin products API:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch products",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      price,
      compare_price,
      description,
      short_description,
      sku,
      category_id,
      room_type_id,
      stock_quantity,
      images,
      tags,
      material,
      color,
      brand,
      is_featured,
      is_trending,
      is_best_seller,
      is_hot_selling,
      is_deal_of_day,
      is_latest,
      status,
    } = body

    console.log("Creating new product:", { name, sku, category_id, room_type_id })

    const insertQuery = `
      INSERT INTO products (
        name, price, compare_price, description, short_description, sku,
        category_id, room_type_id, stock_quantity, images, tags, material, color, brand,
        is_featured, is_trending, is_best_seller, is_hot_selling, is_deal_of_day, is_latest,
        status, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20, $21, NOW(), NOW()
      ) RETURNING id
    `

    const result = await sql`
      INSERT INTO products (
        name, price, compare_price, description, short_description, sku,
        category_id, room_type_id, stock_quantity, images, tags, material, color, brand,
        is_featured, is_trending, is_best_seller, is_hot_selling, is_deal_of_day, is_latest,
        status, created_at, updated_at
      ) VALUES (
        ${name}, ${price}, ${compare_price || null}, ${description}, ${short_description}, ${sku},
        ${category_id}, ${room_type_id || null}, ${stock_quantity}, ${JSON.stringify(images || [])}, 
        ${JSON.stringify(tags || [])}, ${material}, ${color}, ${brand},
        ${is_featured || false}, ${is_trending || false}, ${is_best_seller || false}, 
        ${is_hot_selling || false}, ${is_deal_of_day || false}, ${is_latest || false},
        ${status || "active"}, NOW(), NOW()
      ) RETURNING id
    `

    console.log("Product created with ID:", result[0].id)

    return NextResponse.json({
      success: true,
      product: { id: result[0].id, ...body },
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create product",
      },
      { status: 500 },
    )
  }
}
