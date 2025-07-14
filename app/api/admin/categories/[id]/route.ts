import type { NextRequest } from "next/server"
import { executeQuery, executeQuerySingle } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// PUT /api/admin/categories/[id] - Update category
export const PUT = requireAuth(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { name, description, image_url, status } = await request.json()

    const [category] = await executeQuery(
      `
      UPDATE categories SET 
        name = $1, description = $2, image_url = $3, status = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `,
      [name, description, image_url, status, params.id],
    )

    if (!category) {
      return Response.json({ error: "Category not found" }, { status: 404 })
    }

    return Response.json({ category })
  } catch (error) {
    console.error("Category update error:", error)
    return Response.json({ error: "Failed to update category" }, { status: 500 })
  }
})

// DELETE /api/admin/categories/[id] - Delete category
export const DELETE = requireAuth(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    // Check if category has products
    const productCount = await executeQuerySingle("SELECT COUNT(*) as count FROM products WHERE category_id = $1", [
      params.id,
    ])

    if (productCount && Number.parseInt(productCount.count) > 0) {
      return Response.json(
        {
          error: "Cannot delete category with existing products",
        },
        { status: 400 },
      )
    }

    await executeQuery("DELETE FROM categories WHERE id = $1", [params.id])

    return Response.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Category deletion error:", error)
    return Response.json({ error: "Failed to delete category" }, { status: 500 })
  }
})
