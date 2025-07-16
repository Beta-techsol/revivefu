import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const categories = await sql`
      SELECT 
        id::text as id,
        name, 
        slug, 
        description, 
        image_url,
        parent_id::text as parent_id,
        sort_order,
        is_active,
        created_at,
        updated_at,
        (SELECT COUNT(*) FROM products WHERE category_id = categories.id) as product_count
      FROM categories 
      ORDER BY sort_order ASC, name ASC
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, parent_id, image_url } = body

    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 })
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Check if slug already exists
    const existingSlug = await sql`
      SELECT id FROM categories WHERE slug = ${slug}
    `

    if (existingSlug.length > 0) {
      return NextResponse.json({ success: false, error: "Category name already exists" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO categories (name, slug, description, parent_id, image_url, is_active)
      VALUES (${name}, ${slug}, ${description || ""}, ${parent_id || null}, ${image_url || ""}, true)
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
