import type { NextRequest } from "next/server"
import { sql } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

// GET /api/admin/categories - List all categories
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const categories = await sql`
      SELECT * FROM categories 
      ORDER BY sort_order ASC, name ASC
    `

    return Response.json({ categories })
  } catch (error) {
    console.error("Categories fetch error:", error)
    return Response.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
})

// POST /api/admin/categories - Create new category
export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const { name, description, parent_id, sort_order } = await request.json()

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Check if slug already exists
    const existingCategory = await sql`
      SELECT id FROM categories WHERE slug = ${slug}
    `

    if (existingCategory.length > 0) {
      return Response.json({ error: "Category name already exists" }, { status: 400 })
    }

    const [category] = await sql`
      INSERT INTO categories (name, slug, description, parent_id, sort_order)
      VALUES (${name}, ${slug}, ${description}, ${parent_id}, ${sort_order || 0})
      RETURNING *
    `

    return Response.json({ category }, { status: 201 })
  } catch (error) {
    console.error("Category creation error:", error)
    return Response.json({ error: "Failed to create category" }, { status: 500 })
  }
})
