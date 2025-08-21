import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: categoryId } = params
    const body = await request.json()
    const { productIds } = body

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ success: false, error: "Product IDs are required" }, { status: 400 })
    }

    // Verify category exists
    const category = await sql`
      SELECT id FROM categories WHERE id = ${categoryId}
    `

    if (category.length === 0) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    // Insert into product_categories junction table (ON CONFLICT DO NOTHING to avoid duplicates)
    const insertValues = productIds.map((productId) => `('${productId}', '${categoryId}')`).join(", ")

    const result = await sql.unsafe(`
      INSERT INTO product_categories (product_id, category_id)
      VALUES ${insertValues}
      ON CONFLICT (product_id, category_id) DO NOTHING
      RETURNING product_id
    `)

    // Get product names for response
    const products = await sql`
      SELECT id, name FROM products WHERE id = ANY(${productIds})
    `

    return NextResponse.json({
      success: true,
      message: `${result.length} products assigned to category successfully (${productIds.length - result.length} were already assigned)`,
      data: products,
    })
  } catch (error: any) {
    console.error("Error bulk assigning products:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
