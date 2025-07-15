import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const status = searchParams.get("status")

    const offset = (page - 1) * limit

    console.log("Admin Products API - Query params:", {
      page,
      limit,
      category,
      search,
      status,
      offset,
    })

    const whereConditions = []

    // Build WHERE conditions
    if (category && category !== "all") {
      whereConditions.push(`c.slug = '${category}'`)
    }

    if (search) {
      whereConditions.push(
        `(p.name ILIKE '%${search}%' OR p.description ILIKE '%${search}%' OR p.sku ILIKE '%${search}%')`,
      )
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

    console.log("Count query:", countQuery)
    const totalResult = await sql`${sql.unsafe(countQuery)}`
    const total = Number.parseInt(totalResult[0]?.total || "0")

    // Get products with pagination
    const productsQuery = `
      SELECT 
        p.id,
        p.name,
        p.price::numeric as price,
        p.compare_price::numeric as compare_price,
        p.cost_price::numeric as cost_price,
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
        p.category_id,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.slug as category_slug,
        rt.name as room_type_name,
        rt.slug as room_type_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN room_type rt ON p.room_type_id = rt.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    console.log("Products query:", productsQuery)
    const products = await sql`${sql.unsafe(productsQuery)}`

    // Transform products to ensure proper data types
    const transformedProducts = products.map((product: any) => ({
      ...product,
      price: Number.parseFloat(product.price) || 0,
      compare_price: product.compare_price ? Number.parseFloat(product.compare_price) : null,
      cost_price: product.cost_price ? Number.parseFloat(product.cost_price) : null,
      average_rating: Number.parseFloat(product.average_rating) || 0,
      review_count: Number.parseInt(product.review_count) || 0,
      stock_quantity: Number.parseInt(product.stock_quantity) || 0,
      images: typeof product.images === "string" ? JSON.parse(product.images) : product.images || [],
      tags: typeof product.tags === "string" ? JSON.parse(product.tags) : product.tags || [],
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
    const body = await request.json()

    console.log("Creating new product:", body)

    const {
      name,
      price,
      compare_price,
      cost_price,
      description,
      short_description,
      sku,
      status,
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
      room_type_id,
      category_id,
    } = body

    // Insert the new product
    const newProducts = await sql`
      INSERT INTO products (
        name, price, compare_price, cost_price, description, short_description,
        sku, status, stock_quantity, images, tags, material, color, brand,
        is_featured, is_trending, is_best_seller, is_hot_selling, is_deal_of_day, is_latest,
        room_type_id, category_id, created_at, updated_at
      ) VALUES (
        ${name}, ${price}, ${compare_price || null}, ${cost_price || null}, 
        ${description}, ${short_description}, ${sku}, ${status}, ${stock_quantity},
        ${JSON.stringify(images)}, ${JSON.stringify(tags)}, ${material}, ${color}, ${brand},
        ${is_featured || false}, ${is_trending || false}, ${is_best_seller || false},
        ${is_hot_selling || false}, ${is_deal_of_day || false}, ${is_latest || false},
        ${room_type_id || null}, ${category_id || null}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
      RETURNING *
    `

    console.log("Product created successfully:", newProducts[0].name)

    return NextResponse.json({
      success: true,
      product: newProducts[0],
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
