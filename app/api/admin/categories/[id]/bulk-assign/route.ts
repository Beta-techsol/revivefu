import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: categoryId } = params
    const body = await request.json()
    const { productIds } = body

    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json({ success: false, error: "Product IDs array is required" }, { status: 400 })
    }

    // Verify category exists
    const category = await sql`
      SELECT id FROM categories WHERE id = ${categoryId}
    `

    if (category.length === 0) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    const currentlyAssigned = await sql`
      SELECT id::text as id FROM products WHERE category_id = ${categoryId}
    `
    const currentlyAssignedIds = currentlyAssigned.map((p) => p.id)

    await sql.begin(async (sql) => {
      // Remove products that are no longer selected (set category_id to NULL)
      const toRemove = currentlyAssignedIds.filter((id) => !productIds.includes(id))
      if (toRemove.length > 0) {
        await sql`
          UPDATE products 
          SET category_id = NULL, updated_at = NOW()
          WHERE id = ANY(${toRemove})
        `
      }

      // Assign newly selected products to this category
      const toAdd = productIds.filter((id) => !currentlyAssignedIds.includes(id))
      if (toAdd.length > 0) {
        await sql`
          UPDATE products 
          SET category_id = ${categoryId}, updated_at = NOW()
          WHERE id = ANY(${toAdd})
        `
      }
    })

    const updatedProducts = await sql`
      SELECT id::text as id, name FROM products WHERE category_id = ${categoryId}
    `

    return NextResponse.json({
      success: true,
      message: `Products updated successfully for category`,
      data: {
        assigned: updatedProducts,
        totalAssigned: updatedProducts.length,
        changes: {
          added: productIds.filter((id) => !currentlyAssignedIds.includes(id)).length,
          removed: currentlyAssignedIds.filter((id) => !productIds.includes(id)).length,
        },
      },
    })
  } catch (error: any) {
    console.error("Error bulk assigning products:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
