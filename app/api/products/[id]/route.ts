import type { NextRequest } from "next/server"
import { sql } from "@/lib/db"

// GET /api/products/[id] - Get single product (public)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [product] = await sql`
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ${params.id} AND p.status = 'active'
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
}
