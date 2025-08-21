import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: categoryId } = params

    const products = await sql`
      SELECT 
        p.id::text as id,
        p.name,
        p.sku,
        p.price,
        p.stock_quantity,
        p.status,
        p.images,
        p.created_at
      FROM products p
      INNER JOIN product_categories pc ON p.id = pc.product_id
      WHERE pc.category_id = ${categoryId}
      ORDER BY p.created_at DESC
    `

    return NextResponse.json({
      success: true,
      data: products,
    })
  } catch (error: any) {
    console.error("Error fetching category products:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: categoryId } = params
    const body = await request.json()
    const { productIds } = body

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ success: false, error: "Product IDs are required" }, { status: 400 })
    }

    // Remove products from this category
    const result = await sql`
      DELETE FROM product_categories 
      WHERE category_id = ${categoryId} AND product_id = ANY(${productIds})
      RETURNING product_id
    `

    return NextResponse.json({
      success: true,
      message: `${result.length} products removed from category successfully`,
      data: result,
    })
  } catch (error: any) {
    console.error("Error removing products from category:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
