import type { NextRequest } from "next/server"
import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

// GET /api/admin/products - List all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const status = searchParams.get("status") || ""

    const offset = (page - 1) * limit

    console.log("Fetching admin products with params:", { page, limit, search, category, status })

    let products
    let totalResult

    if (search || category || status) {
      // Complex query with filters
      if (search && category && status) {
        products = await sql`
          SELECT 
            p.id, p.name, p.slug, p.description, p.short_description, p.sku, p.price, p.compare_price, p.cost,
            p.category_id, p.stock_quantity, p.track_quantity, p.continue_selling, p.weight, p.dimensions,
            p.material, p.color, p.brand, p.status, p.images, p.primary_image_index, p.tags,
            p.is_featured, p.is_trending, p.is_best_seller, p.is_hot_selling, p.is_deal_of_day, p.is_latest,
            p.room_type, p.meta_title, p.meta_description, p.average_rating, p.review_count,
            p.created_at, p.updated_at, COALESCE(c.name, 'Uncategorized') as category_name
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE (p.name ILIKE ${`%${search}%`} OR p.sku ILIKE ${`%${search}%`})
            AND c.slug = ${category}
            AND p.status = ${status}
          ORDER BY p.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `
        totalResult = await sql`
          SELECT COUNT(*) as total
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE (p.name ILIKE ${`%${search}%`} OR p.sku ILIKE ${`%${search}%`})
            AND c.slug = ${category}
            AND p.status = ${status}
        `
      } else if (search && category) {
        products = await sql`
          SELECT 
            p.id, p.name, p.slug, p.description, p.short_description, p.sku, p.price, p.compare_price, p.cost,
            p.category_id, p.stock_quantity, p.track_quantity, p.continue_selling, p.weight, p.dimensions,
            p.material, p.color, p.brand, p.status, p.images, p.primary_image_index, p.tags,
            p.is_featured, p.is_trending, p.is_best_seller, p.is_hot_selling, p.is_deal_of_day, p.is_latest,
            p.room_type, p.meta_title, p.meta_description, p.average_rating, p.review_count,
            p.created_at, p.updated_at, COALESCE(c.name, 'Uncategorized') as category_name
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE (p.name ILIKE ${`%${search}%`} OR p.sku ILIKE ${`%${search}%`})
            AND c.slug = ${category}
          ORDER BY p.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `
        totalResult = await sql`
          SELECT COUNT(*) as total
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE (p.name ILIKE ${`%${search}%`} OR p.sku ILIKE ${`%${search}%`})
            AND c.slug = ${category}
        `
      } else if (search && status) {
        products = await sql`
          SELECT 
            p.id, p.name, p.slug, p.description, p.short_description, p.sku, p.price, p.compare_price, p.cost,
            p.category_id, p.stock_quantity, p.track_quantity, p.continue_selling, p.weight, p.dimensions,
            p.material, p.color, p.brand, p.status, p.images, p.primary_image_index, p.tags,
            p.is_featured, p.is_trending, p.is_best_seller, p.is_hot_selling, p.is_deal_of_day, p.is_latest,
            p.room_type, p.meta_title, p.meta_description, p.average_rating, p.review_count,
            p.created_at, p.updated_at, COALESCE(c.name, 'Uncategorized') as category_name
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE (p.name ILIKE ${`%${search}%`} OR p.sku ILIKE ${`%${search}%`})
            AND p.status = ${status}
          ORDER BY p.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `
        totalResult = await sql`
          SELECT COUNT(*) as total
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE (p.name ILIKE ${`%${search}%`} OR p.sku ILIKE ${`%${search}%`})
            AND p.status = ${status}
        `
      } else if (category && status) {
        products = await sql`
          SELECT 
            p.id, p.name, p.slug, p.description, p.short_description, p.sku, p.price, p.compare_price, p.cost,
            p.category_id, p.stock_quantity, p.track_quantity, p.continue_selling, p.weight, p.dimensions,
            p.material, p.color, p.brand, p.status, p.images, p.primary_image_index, p.tags,
            p.is_featured, p.is_trending, p.is_best_seller, p.is_hot_selling, p.is_deal_of_day, p.is_latest,
            p.room_type, p.meta_title, p.meta_description, p.average_rating, p.review_count,
            p.created_at, p.updated_at, COALESCE(c.name, 'Uncategorized') as category_name
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE c.slug = ${category}
            AND p.status = ${status}
          ORDER BY p.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `
        totalResult = await sql`
          SELECT COUNT(*) as total
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE c.slug = ${category}
            AND p.status = ${status}
        `
      } else if (search) {
        products = await sql`
          SELECT 
            p.id, p.name, p.slug, p.description, p.short_description, p.sku, p.price, p.compare_price, p.cost,
            p.category_id, p.stock_quantity, p.track_quantity, p.continue_selling, p.weight, p.dimensions,
            p.material, p.color, p.brand, p.status, p.images, p.primary_image_index, p.tags,
            p.is_featured, p.is_trending, p.is_best_seller, p.is_hot_selling, p.is_deal_of_day, p.is_latest,
            p.room_type, p.meta_title, p.meta_description, p.average_rating, p.review_count,
            p.created_at, p.updated_at, COALESCE(c.name, 'Uncategorized') as category_name
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE (p.name ILIKE ${`%${search}%`} OR p.sku ILIKE ${`%${search}%`})
          ORDER BY p.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `
        totalResult = await sql`
          SELECT COUNT(*) as total
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE (p.name ILIKE ${`%${search}%`} OR p.sku ILIKE ${`%${search}%`})
        `
      } else if (category && category !== "all") {
        products = await sql`
          SELECT 
            p.id, p.name, p.slug, p.description, p.short_description, p.sku, p.price, p.compare_price, p.cost,
            p.category_id, p.stock_quantity, p.track_quantity, p.continue_selling, p.weight, p.dimensions,
            p.material, p.color, p.brand, p.status, p.images, p.primary_image_index, p.tags,
            p.is_featured, p.is_trending, p.is_best_seller, p.is_hot_selling, p.is_deal_of_day, p.is_latest,
            p.room_type, p.meta_title, p.meta_description, p.average_rating, p.review_count,
            p.created_at, p.updated_at, COALESCE(c.name, 'Uncategorized') as category_name
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE c.slug = ${category}
          ORDER BY p.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `
        totalResult = await sql`
          SELECT COUNT(*) as total
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE c.slug = ${category}
        `
      } else if (status) {
        products = await sql`
          SELECT 
            p.id, p.name, p.slug, p.description, p.short_description, p.sku, p.price, p.compare_price, p.cost,
            p.category_id, p.stock_quantity, p.track_quantity, p.continue_selling, p.weight, p.dimensions,
            p.material, p.color, p.brand, p.status, p.images, p.primary_image_index, p.tags,
            p.is_featured, p.is_trending, p.is_best_seller, p.is_hot_selling, p.is_deal_of_day, p.is_latest,
            p.room_type, p.meta_title, p.meta_description, p.average_rating, p.review_count,
            p.created_at, p.updated_at, COALESCE(c.name, 'Uncategorized') as category_name
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE p.status = ${status}
          ORDER BY p.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `
        totalResult = await sql`
          SELECT COUNT(*) as total
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE p.status = ${status}
        `
      }
    } else {
      // Simple query without filters
      products = await sql`
        SELECT 
          p.id, p.name, p.slug, p.description, p.short_description, p.sku, p.price, p.compare_price, p.cost,
          p.category_id, p.stock_quantity, p.track_quantity, p.continue_selling, p.weight, p.dimensions,
          p.material, p.color, p.brand, p.status, p.images, p.primary_image_index, p.tags,
          p.is_featured, p.is_trending, p.is_best_seller, p.is_hot_selling, p.is_deal_of_day, p.is_latest,
          p.room_type, p.meta_title, p.meta_description, p.average_rating, p.review_count,
          p.created_at, p.updated_at, COALESCE(c.name, 'Uncategorized') as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      totalResult = await sql`
        SELECT COUNT(*) as total
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
      `
    }

    const total = Number.parseInt(totalResult[0]?.total || "0")

    console.log("Found products:", products.length)
    console.log("Total count:", total)

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
    console.error("Error fetching admin products:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Creating product with data:", body)

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
        ${name}, ${slug}, ${description || ""}, ${short_description || ""}, ${sku}, 
        ${price}, ${compare_price || null}, ${cost || null}, ${category_id || null},
        ${stock_quantity || 0}, ${track_quantity !== false}, ${continue_selling === true},
        ${weight || null}, ${dimensions ? JSON.stringify(dimensions) : null},
        ${material || ""}, ${color || ""}, ${brand || ""}, ${status || "active"},
        ${images ? JSON.stringify(images) : "[]"}, ${primary_image_index || 0},
        ${tags ? JSON.stringify(tags) : "[]"}, ${is_featured === true},
        ${is_trending === true}, ${is_best_seller === true}, ${is_hot_selling === true},
        ${is_deal_of_day === true}, ${is_latest === true}, ${room_type || ""},
        ${meta_title || ""}, ${meta_description || ""}
      )
      RETURNING *
    `

    console.log("Product created successfully:", result[0])

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
