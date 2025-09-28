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
      INNER JOIN product_categories pc ON pc.product_id = p.id
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
