import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: categoryId } = params

    const products = await sql`
      SELECT 
        id::text as id,
        name,
        sku,
        price,
        stock_quantity,
        status,
        images,
        created_at
      FROM products 
      WHERE category_id = ${categoryId}
      ORDER BY created_at DESC
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
