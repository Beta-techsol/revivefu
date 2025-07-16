import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const categoryId = params.id

    const products = await sql`
      SELECT 
        id::text as id,
        name,
        sku,
        price::numeric as price,
        stock_quantity,
        status,
        images
      FROM products 
      WHERE category_id = ${categoryId}
      ORDER BY name ASC
    `

    return NextResponse.json({
      success: true,
      data: products,
    })
  } catch (error) {
    console.error("Error fetching category products:", error)
    return NextResponse.json({ error: "Failed to fetch category products" }, { status: 500 })
  }
}
