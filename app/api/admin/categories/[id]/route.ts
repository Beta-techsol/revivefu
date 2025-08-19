import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const category = await sql`
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
      WHERE id = ${id}
    `

    if (category.length === 0) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: category[0],
    })
  } catch (error: any) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, description, image_url, status, parent_id } = body

    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 })
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Check if slug already exists for other categories
    const existingSlug = await sql`
      SELECT id FROM categories WHERE slug = ${slug} AND id != ${id}
    `

    if (existingSlug.length > 0) {
      return NextResponse.json({ success: false, error: "Category name already exists" }, { status: 400 })
    }

    const parentIdValue = parent_id && parent_id !== "" ? parent_id : null

    const result = await sql`
      UPDATE categories 
      SET 
        name = ${name},
        slug = ${slug},
        description = ${description || ""},
        image_url = ${image_url || ""},
        parent_id = ${parentIdValue},
        is_active = ${status === "active" ? true : false},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      data: result[0],
    })
  } catch (error: any) {
    console.error("Error updating category:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const productsCount = await sql`
      SELECT COUNT(*) as count FROM products WHERE category_id = ${id}
    `

    if (productsCount[0].count > 0) {
      await sql`
        UPDATE products SET category_id = NULL WHERE category_id = ${id}
      `
    }

    const childCategories = await sql`
      SELECT COUNT(*) as count FROM categories WHERE parent_id = ${id}
    `

    if (childCategories[0].count > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete category with child categories. Please delete or reassign child categories first.",
        },
        { status: 400 },
      )
    }

    const result = await sql`
      DELETE FROM categories WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
