import type { NextRequest } from "next/server"
import { executeQuery, executeQuerySingle } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// GET /api/admin/products/[id] - Get single product
export const GET = requireAuth(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const product = await executeQuerySingle(
      `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = $1
    `,
      [params.id],
    )

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 })
    }

    // Get variants
    const variants = await executeQuery("SELECT * FROM product_variants WHERE product_id = $1", [params.id])

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

    // Check if SKU exists for other products
    const existingProduct = await executeQuerySingle("SELECT id FROM products WHERE sku = $1 AND id != $2", [
      sku,
      params.id,
    ])

    if (existingProduct) {
      return Response.json({ error: "SKU already exists" }, { status: 400 })
    }

    // Update product
    const [product] = await executeQuery(
      `
      UPDATE products SET 
        name = $1, description = $2, sku = $3, price = $4, compare_price = $5,
        cost = $6, category_id = $7, stock_quantity = $8, track_quantity = $9,
        continue_selling = $10, status = $11, tags = $12, images = $13,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
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
        params.id,
      ],
    )

    // Update variants
    if (variants) {
      // Delete existing variants
      await executeQuery("DELETE FROM product_variants WHERE product_id = $1", [params.id])

      // Insert new variants
      for (const variant of variants) {
        await executeQuery(
          `
          INSERT INTO product_variants (product_id, color, size, price, stock)
          VALUES ($1, $2, $3, $4, $5)
        `,
          [params.id, variant.color, variant.size, variant.price, variant.stock],
        )
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
    const product = await executeQuerySingle("SELECT id FROM products WHERE id = $1", [params.id])

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 })
    }

    // Delete product (variants will be deleted by CASCADE)
    await executeQuery("DELETE FROM products WHERE id = $1", [params.id])

    return Response.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Product deletion error:", error)
    return Response.json({ error: "Failed to delete product" }, { status: 500 })
  }
})
