import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("Fetching categories from database...")

    const categories = await sql`
      SELECT 
        c.id::text as id,
        c.name, 
        c.slug, 
        c.description, 
        c.image_url,
        c.parent_id::text as parent_id,
        c.sort_order,
        c.is_active,
        c.created_at,
        c.updated_at,
        COALESCE(pc.product_count, 0) as product_count,
        parent.name as parent_name
      FROM categories c
      LEFT JOIN (
        SELECT category_id, COUNT(*) as product_count 
        FROM product_categories 
        GROUP BY category_id
      ) pc ON c.id = pc.category_id
      LEFT JOIN categories parent ON c.parent_id = parent.id
      ORDER BY c.sort_order ASC, c.name ASC
    `

    console.log("Categories fetched:", categories.length)

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
    const { name, description, image_url, parent_id } = body

    console.log("Creating category with data:", { name, description, image_url, parent_id })

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
      INSERT INTO categories (name, slug, description, image_url, parent_id, is_active, sort_order)
      VALUES (${name}, ${slug}, ${description || ""}, ${image_url || ""}, ${parent_id || null}, true, 0)
      RETURNING id::text as id, name, slug, description, image_url, parent_id::text as parent_id, is_active, created_at, updated_at
    `

    console.log("Category created:", result[0])

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
