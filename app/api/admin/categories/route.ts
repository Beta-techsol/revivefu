import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const categories = await sql`
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      WHERE c.is_active = true
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.name ASC
    `

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error: any) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, image_url, parent_id, sort_order } = body

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Validate required fields
    if (!name) {
      return NextResponse.json({ success: false, error: "Category name is required" }, { status: 400 })
    }

    // Check if slug already exists
    const existingSlug = await sql`
      SELECT id FROM categories WHERE slug = ${slug}
    `

    if (existingSlug.length > 0) {
      return NextResponse.json({ success: false, error: "Category with this name already exists" }, { status: 400 })
    }

    // Insert category
    const result = await sql`
      INSERT INTO categories (name, slug, description, image_url, parent_id, sort_order)
      VALUES (${name}, ${slug}, ${description || null}, ${image_url || null}, 
              ${parent_id || null}, ${sort_order || 0})
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      data: result[0],
    })
  } catch (error: any) {
    console.error("Error creating category:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
