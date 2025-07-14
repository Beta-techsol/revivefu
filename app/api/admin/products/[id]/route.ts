import type { NextRequest } from "next/server"
import { sql } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// GET /api/admin/products/[id] - Get single product
export const GET = requireAuth(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const [product] = await sql`
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ${params.id}
    `

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 })
    }

    // Get variants
    const variants = await sql`
      SELECT * FROM product_variants WHERE product_id = ${params.id} ORDER BY created_at
    `

    return Response.json({ product: { ...product, variants } })
  } catch (error) {
    console.error("Product fetch error:", error)
    return Response.json({ error: "Failed to fetch product" }, { status: 500 })
  }
})

// PUT /api/admin/products/[id] - Update product
export const PUT = requireAuth(async (request: NextRequest, { params }: { params: { id: string } }) => {
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

    // Check if SKU exists for other products
    const existingProduct = await sql`
      SELECT id FROM products WHERE sku = ${sku} AND id != ${params.id}
    `

    if (existingProduct.length > 0) {
      return Response.json({ error: "SKU already exists" }, { status: 400 })
    }

    // Check if slug exists for other products
    const existingSlug = await sql`
      SELECT id FROM products WHERE slug = ${slug} AND id != ${params.id}
    `

    if (existingSlug.length > 0) {
      return Response.json({ error: "Product name already exists" }, { status: 400 })
    }

    // Update product
    const [product] = await sql`
      UPDATE products SET 
        name = ${name},
        slug = ${slug},
        description = ${description},
        short_description = ${short_description},
        sku = ${sku},
        price = ${price},
        compare_price = ${compare_price},
        cost = ${cost},
        category_id = ${category_id},
        stock_quantity = ${stock_quantity},
        track_quantity = ${track_quantity},
        continue_selling = ${continue_selling},
        material = ${material},
        color = ${color},
        brand = ${brand},
        status = ${status},
        tags = ${JSON.stringify(tags || [])},
        images = ${JSON.stringify(images || [])},
        is_featured = ${is_featured || false},
        is_trending = ${is_trending || false},
        is_best_seller = ${is_best_seller || false},
        is_hot_selling = ${is_hot_selling || false},
        is_deal_of_day = ${is_deal_of_day || false},
        is_latest = ${is_latest || false},
        room_type = ${room_type},
        meta_title = ${meta_title},
        meta_description = ${meta_description},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
      RETURNING *
    `

    // Update variants
    if (variants) {
      // Delete existing variants
      await sql`DELETE FROM product_variants WHERE product_id = ${params.id}`

      // Insert new variants
      for (const variant of variants) {
        if (variant.color || variant.size || variant.material) {
          await sql`
            INSERT INTO product_variants (product_id, color, size, material, price, compare_price, stock, sku, image_url)
            VALUES (${params.id}, ${variant.color}, ${variant.size}, ${variant.material}, 
                   ${variant.price}, ${variant.compare_price}, ${variant.stock}, ${variant.sku}, ${variant.image_url})
          `
        }
      }
    }

    return Response.json({ product })
  } catch (error) {
    console.error("Product update error:", error)
    return Response.json({ error: "Failed to update product" }, { status: 500 })
  }
})

// DELETE /api/admin/products/[id] - Delete product
export const DELETE = requireAuth(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    // Check if product exists
    const [product] = await sql`
      SELECT id FROM products WHERE id = ${params.id}
    `

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 })
    }

    // Delete product (variants will be deleted by CASCADE)
    await sql`DELETE FROM products WHERE id = ${params.id}`

    return Response.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Product deletion error:", error)
    return Response.json({ error: "Failed to delete product" }, { status: 500 })
  }
})
