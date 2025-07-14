import type { NextRequest } from "next/server"
import { executeQuery } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// GET /api/admin/categories - List all categories
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const categories = await executeQuery(`
      SELECT c.*, COUNT(p.id) as product_count 
      FROM categories c 
      LEFT JOIN products p ON c.id = p.category_id 
      GROUP BY c.id 
      ORDER BY c.created_at DESC
    `)

    return Response.json({ categories })
  } catch (error) {
    console.error("Categories fetch error:", error)
    return Response.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
})

// POST /api/admin/categories - Create new category
export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const { name, description, image_url, status } = await request.json()

    const [category] = await executeQuery(
      `
      INSERT INTO categories (name, description, image_url, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [name, description, image_url, status || "active"],
    )

    return Response.json({ category }, { status: 201 })
  } catch (error) {
    console.error("Category creation error:", error)
    return Response.json({ error: "Failed to create category" }, { status: 500 })
  }
})
