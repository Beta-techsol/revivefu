import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const result = await sql("SELECT * FROM blog_posts WHERE id = $1", [id])

    if (result.length === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const {
      title,
      slug,
      content,
      excerpt,
      featured_image,
      author_name,
      status,
      is_featured,
      meta_title,
      meta_description,
      tags,
      category,
    } = body

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Title, slug, and content are required" }, { status: 400 })
    }

    // Check if slug already exists for other posts
    const existingPost = await sql("SELECT id FROM blog_posts WHERE slug = $1 AND id != $2", [slug, id])

    if (existingPost.length > 0) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
    }

    const published_at = status === "published" ? new Date().toISOString() : null

    const result = await sql(
      `
      UPDATE blog_posts SET
        title = $1, slug = $2, content = $3, excerpt = $4, featured_image = $5,
        author_name = $6, status = $7, is_featured = $8, meta_title = $9,
        meta_description = $10, tags = $11, category = $12, published_at = $13,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
      RETURNING *
    `,
      [
        title,
        slug,
        content,
        excerpt,
        featured_image,
        author_name,
        status,
        is_featured,
        meta_title,
        meta_description,
        JSON.stringify(tags),
        category,
        published_at,
        id,
      ],
    )

    if (result.length === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating blog post:", error)
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const result = await sql("DELETE FROM blog_posts WHERE id = $1 RETURNING *", [id])

    if (result.length === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Blog post deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}
