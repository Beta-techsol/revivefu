import type { NextRequest } from "next/server"
import { executeQuery, executeQuerySingle } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// GET /api/admin/products - List all products
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const offset = (page - 1) * limit

    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE 1=1
    `
    const params: any[] = []
    let paramIndex = 1

    if (category && category !== "all") {
      query += ` AND c.name ILIKE $${paramIndex}`
      params.push(`%${category}%`)
      paramIndex++
    }

    if (search) {
      query += ` AND (p.name ILIKE $${paramIndex} OR p.sku ILIKE $${paramIndex + 1} OR $${paramIndex + 2} = ANY(p.tags))`
      params.push(`%${search}%`, `%${search}%`, search)
      paramIndex += 3
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    const products = await executeQuery(query, params)

    // Get total count for pagination
    let countQuery = "SELECT COUNT(*) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1"
    const countParams: any[] = []
    let countParamIndex = 1

    if (category && category !== "all") {
      countQuery += ` AND c.name ILIKE $${countParamIndex}`
      countParams.push(`%${category}%`)
      countParamIndex++
    }

    if (search) {
      countQuery += ` AND (p.name ILIKE $${countParamIndex} OR p.sku ILIKE $${countParamIndex + 1} OR $${countParamIndex + 2} = ANY(p.tags))`
      countParams.push(`%${search}%`, `%${search}%`, search)
    }

    const [{ total }] = await executeQuery(countQuery, countParams)

    return Response.json({
      products,
      pagination: {
        page,
        limit,
        total: Number.parseInt(total),
        pages: Math.ceil(total / limit),
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
      sku,
      price,
      compare_price,
      cost,
      category_id,
      stock_quantity,
      track_quantity,
      continue_selling,
      status,
      tags,
      images,
      variants,
    } = data

    // Check if SKU already exists
    const existingProduct = await executeQuerySingle("SELECT id FROM products WHERE sku = $1", [sku])

    if (existingProduct) {
      return Response.json({ error: "SKU already exists" }, { status: 400 })
    }

    // Insert product
    const [product] = await executeQuery(
      `
      INSERT INTO products (
        name, description, sku, price, compare_price, cost, category_id,
        stock_quantity, track_quantity, continue_selling, status, tags, images
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `,
      [
        name,
        description,
        sku,
        price,
        compare_price,
        cost,
        category_id,
        stock_quantity,
        track_quantity,
        continue_selling,
        status,
        tags,
        images,
      ],
    )

    // Insert variants if provided
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        await executeQuery(
          `
          INSERT INTO product_variants (product_id, color, size, price, stock)
          VALUES ($1, $2, $3, $4, $5)
        `,
          [product.id, variant.color, variant.size, variant.price, variant.stock],
        )
      }
    }

    return Response.json({ product }, { status: 201 })
  } catch (error) {
    console.error("Product creation error:", error)
    return Response.json({ error: "Failed to create product" }, { status: 500 })
  }
})
