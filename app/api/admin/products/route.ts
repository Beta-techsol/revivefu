import type { NextRequest } from "next/server"
import { sql } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// GET /api/admin/products - List all products
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const offset = (page - 1) * limit

    const whereConditions = ["1=1"]
    const queryParams: any[] = []
    let paramIndex = 1

    if (category && category !== "all") {
      whereConditions.push(`c.slug = $${paramIndex}`)
      queryParams.push(category)
      paramIndex++
    }

    if (search) {
      whereConditions.push(
        `(p.name ILIKE $${paramIndex} OR p.sku ILIKE $${paramIndex + 1} OR p.brand ILIKE $${paramIndex + 2})`,
      )
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`)
      paramIndex += 3
    }

    if (status && status !== "all") {
      whereConditions.push(`p.status = $${paramIndex}`)
      queryParams.push(status)
      paramIndex++
    }

    const whereClause = whereConditions.join(" AND ")

    const products = await sql`
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE ${sql.unsafe(whereClause)}
      ORDER BY p.created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `.values(queryParams)

    // Get total count for pagination
    const [{ count: total }] = await sql`
      SELECT COUNT(*) as count
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE ${sql.unsafe(whereClause)}
    `.values(queryParams)

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
})

// POST /api/admin/products - Create new product
export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const data = await request.json()
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
      material,
      color,
      brand,
      status,
      tags,
      images,
      variants,
      // Display flags
      is_featured,
      is_trending,
      is_best_seller,
      is_hot_selling,
      is_deal_of_day,
      is_latest,
      room_type,
      meta_title,
      meta_description,
    } = data

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Check if SKU already exists
    const existingProduct = await sql`
      SELECT id FROM products WHERE sku = ${sku}
    `

    if (existingProduct.length > 0) {
      return Response.json({ error: "SKU already exists" }, { status: 400 })
    }

    // Check if slug already exists
    const existingSlug = await sql`
      SELECT id FROM products WHERE slug = ${slug}
    `

    if (existingSlug.length > 0) {
      return Response.json({ error: "Product name already exists" }, { status: 400 })
    }

    // Insert product
    const [product] = await sql`
      INSERT INTO products (
        name, slug, description, short_description, sku, price, compare_price, cost,
        category_id, stock_quantity, track_quantity, continue_selling, material, color, brand,
        status, tags, images, is_featured, is_trending, is_best_seller, is_hot_selling,
        is_deal_of_day, is_latest, room_type, meta_title, meta_description
      ) VALUES (
        ${name}, ${slug}, ${description}, ${short_description}, ${sku}, ${price}, 
        ${compare_price}, ${cost}, ${category_id}, ${stock_quantity}, ${track_quantity}, 
        ${continue_selling}, ${material}, ${color}, ${brand}, ${status}, 
        ${JSON.stringify(tags || [])}, ${JSON.stringify(images || [])}, 
        ${is_featured || false}, ${is_trending || false}, ${is_best_seller || false}, 
        ${is_hot_selling || false}, ${is_deal_of_day || false}, ${is_latest || false}, 
        ${room_type}, ${meta_title}, ${meta_description}
      )
      RETURNING *
    `

    // Insert variants if provided
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        if (variant.color || variant.size || variant.material) {
          await sql`
            INSERT INTO product_variants (product_id, color, size, material, price, compare_price, stock, sku, image_url)
            VALUES (${product.id}, ${variant.color}, ${variant.size}, ${variant.material}, 
                   ${variant.price}, ${variant.compare_price}, ${variant.stock}, ${variant.sku}, ${variant.image_url})
          `
        }
      }
    }

    return Response.json({ product }, { status: 201 })
  } catch (error) {
    console.error("Product creation error:", error)
    return Response.json({ error: "Failed to create product" }, { status: 500 })
  }
})
