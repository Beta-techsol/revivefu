import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const status = searchParams.get("status")

    const offset = (page - 1) * limit

    console.log("Admin Products API - Query params:", { page, limit, category, search, status, offset })

    const whereConditions = []
    const queryParams = []

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
      average_rating: Number.parseFloat(product.average_rating) || 0,
      review_count: Number.parseInt(product.review_count) || 0,
      stock_quantity: Number.parseInt(product.stock_quantity) || 0,
      room_type_id: product.room_type_id ? Number.parseInt(product.room_type_id) : null,
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
      data: transformedProducts,
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

    const {
      name,
      description,
      short_description,
      sku,
      price,
      compare_price,
      cost,
      category_id,
      room_type_id,
      stock_quantity,
      track_quantity,
      continue_selling,
      weight,
      material,
      color,
      brand,
      status,
      images,
      tags,
      is_featured,
      is_trending,
      is_best_seller,
      is_hot_selling,
      is_deal_of_day,
      is_latest,
      meta_title,
      meta_description,
    } = body

    // Validate required fields
    if (!name || !sku || price === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, SKU, and price are required",
        },
        { status: 400 },
      )
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const result = await sql`
      INSERT INTO products (
        name, description, short_description, sku, price, compare_price, cost,
        category_id, room_type_id, stock_quantity, track_quantity, continue_selling,
        weight, material, color, brand, status, images, tags,
        is_featured, is_trending, is_best_seller, is_hot_selling, is_deal_of_day, is_latest,
        slug, meta_title, meta_description
      ) VALUES (
        ${name}, ${description || ""}, ${short_description || ""}, ${sku}, ${price}, 
        ${compare_price || null}, ${cost || null}, ${category_id || null}, ${room_type_id || null},
        ${stock_quantity || 0}, ${track_quantity || false}, ${continue_selling || false},
        ${weight || null}, ${material || ""}, ${color || ""}, ${brand || ""}, ${status || "active"},
        ${JSON.stringify(images || [])}, ${JSON.stringify(tags || [])},
        ${is_featured || false}, ${is_trending || false}, ${is_best_seller || false},
        ${is_hot_selling || false}, ${is_deal_of_day || false}, ${is_latest || false},
        ${slug}, ${meta_title || ""}, ${meta_description || ""}
      )
      RETURNING id, name, sku, slug
    `

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      data: result[0],
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
