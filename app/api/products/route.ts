import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const room_type = searchParams.get("room_type")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "created_at"
    const order = searchParams.get("order") || "desc"
    const min_price = searchParams.get("min_price")
    const max_price = searchParams.get("max_price")

    const offset = (page - 1) * limit

    console.log("Products API - Query params:", {
      page,
      limit,
      category,
      room_type,
      search,
      sort,
      order,
      min_price,
      max_price,
    })

    // Build WHERE conditions
    const whereConditions = ["p.status = 'active'"]
    const queryParams: any[] = []

    if (category) {
      whereConditions.push(`c.slug = $${queryParams.length + 1}`)
      queryParams.push(category)
    }

    if (room_type) {
      whereConditions.push(`rt.slug = $${queryParams.length + 1}`)
      queryParams.push(room_type)
    }

    if (search) {
      whereConditions.push(
        `(p.name ILIKE $${queryParams.length + 1} OR p.description ILIKE $${queryParams.length + 1})`,
      )
      queryParams.push(`%${search}%`)
    }

    if (min_price) {
      whereConditions.push(`p.price >= $${queryParams.length + 1}`)
      queryParams.push(Number.parseFloat(min_price))
    }

    if (max_price) {
      whereConditions.push(`p.price <= $${queryParams.length + 1}`)
      queryParams.push(Number.parseFloat(max_price))
    }

    const whereClause = whereConditions.join(" AND ")

    // Validate sort column
    const validSortColumns = ["name", "price", "created_at", "average_rating"]
    const sortColumn = validSortColumns.includes(sort) ? sort : "created_at"
    const sortOrder = order === "asc" ? "ASC" : "DESC"

    // Get products with proper JOINs
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
        rt.name as room_type,
        rt.slug as room_type_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN room_types rt ON p.room_type_id = rt.id
      WHERE ${whereClause}
      ORDER BY p.${sortColumn} ${sortOrder}
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `

    queryParams.push(limit, offset)

    console.log("Products query:", productsQuery)
    console.log("Query params:", queryParams)

    const products = await sql(productsQuery, queryParams)

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN room_types rt ON p.room_type_id = rt.id
      WHERE ${whereClause}
    `

    const countParams = queryParams.slice(0, -2) // Remove limit and offset
    const countResult = await sql(countQuery, countParams)
    const total = Number.parseInt(countResult[0].total)

    // Transform products to ensure proper data types
    const transformedProducts = products.map((product: any) => ({
      ...product,
      price: Number.parseFloat(product.price) || 0,
      compare_price: product.compare_price ? Number.parseFloat(product.compare_price) : null,
      average_rating: Number.parseFloat(product.average_rating) || 0,
      review_count: Number.parseInt(product.review_count) || 0,
      stock_quantity: Number.parseInt(product.stock_quantity) || 0,
      images: typeof product.images === "string" ? JSON.parse(product.images) : product.images || [],
      tags: typeof product.tags === "string" ? JSON.parse(product.tags) : product.tags || [],
    }))

    console.log("Products API - Results:", {
      productsCount: transformedProducts.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })

    return NextResponse.json({
      success: true,
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error in products API:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch products",
      },
      { status: 500 },
    )
  }
}
