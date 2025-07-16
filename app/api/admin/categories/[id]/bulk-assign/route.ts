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
    const categoryExists = await sql`
      SELECT id FROM categories WHERE id = ${categoryId}
    `

    if (categoryExists.length === 0) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    // Update products to assign them to the category
    const result = await sql`
      UPDATE products 
      SET category_id = ${categoryId}, updated_at = NOW()
      WHERE id = ANY(${productIds})
      RETURNING id, name
    `

    return NextResponse.json({
      success: true,
      message: `${result.length} products assigned to category successfully`,
      data: result,
    })
  } catch (error: any) {
    console.error("Error bulk assigning products:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
