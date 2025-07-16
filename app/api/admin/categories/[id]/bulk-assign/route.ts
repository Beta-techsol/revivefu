import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { productIds } = await request.json()
    const categoryId = params.id

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: "Product IDs are required" }, { status: 400 })
    }

    // Update all specified products to use this category
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
  } catch (error) {
    console.error("Bulk assign error:", error)
    return NextResponse.json({ error: "Failed to assign products to category" }, { status: 500 })
  }
}
