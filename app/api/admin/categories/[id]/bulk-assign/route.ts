import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: categoryId } = params
    const body = await request.json()
    const { productIds, action = "assign" } = body // Added action parameter to support add/remove

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

    let result
    if (action === "remove") {
      result = await sql`
        DELETE FROM product_categories 
        WHERE category_id = ${categoryId} AND product_id = ANY(${productIds})
        RETURNING product_id
      `
    } else {
      const values = productIds.map((productId) => `('${productId}', '${categoryId}')`).join(",")
      result = await sql`
        INSERT INTO product_categories (product_id, category_id)
        VALUES ${sql.unsafe(values)}
        ON CONFLICT (product_id, category_id) DO NOTHING
        RETURNING product_id
      `
    }

    const actionText = action === "remove" ? "removed from" : "assigned to"
    return NextResponse.json({
      success: true,
      message: `${result.length} products ${actionText} category successfully`,
      data: result,
    })
  } catch (error: any) {
    console.error("Error bulk assigning products:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: categoryId } = params

    // Get products already assigned to this category
    const assignedProducts = await sql`
      SELECT p.id, p.name, p.sku, p.price, p.stock_quantity, p.status
      FROM products p
      INNER JOIN product_categories pc ON p.id = pc.product_id
      WHERE pc.category_id = ${categoryId}
      ORDER BY p.name
    `

    return NextResponse.json({
      success: true,
      data: assignedProducts,
    })
  } catch (error: any) {
    console.error("Error fetching assigned products:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
