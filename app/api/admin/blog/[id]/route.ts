import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const postId = Number.parseInt(id)

    if (isNaN(postId)) {
      return NextResponse.json({ success: false, error: "Invalid post ID" }, { status: 400 })
    }

    const posts = await sql`
      SELECT * FROM blog_posts WHERE id = ${postId}
    `

    if (posts.length === 0) {
      return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      post: posts[0],
    })
  } catch (error: any) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const postId = Number.parseInt(id)

    if (isNaN(postId)) {
      return NextResponse.json({ success: false, error: "Invalid post ID" }, { status: 400 })
    }

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
      tags = [],
      category,
    } = body

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json({ success: false, error: "Title, slug, and content are required" }, { status: 400 })
    }

    // Check if slug already exists for other posts
    const existingPost = await sql`
      SELECT id FROM blog_posts WHERE slug = ${slug} AND id != ${postId}
    `

    if (existingPost.length > 0) {
      return NextResponse.json({ success: false, error: "Slug already exists" }, { status: 400 })
    }

    const published_at = status === "published" ? new Date().toISOString() : null
    const tagsJson = JSON.stringify(tags)

    const result = await sql`
      UPDATE blog_posts 
      SET title = ${title},
          slug = ${slug},
          content = ${content},
          excerpt = ${excerpt},
          featured_image = ${featured_image},
          author_name = ${author_name},
          status = ${status},
          is_featured = ${is_featured},
          meta_title = ${meta_title},
          meta_description = ${meta_description},
          tags = ${tagsJson},
          category = ${category},
          published_at = ${published_at},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${postId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      post: result[0],
      message: "Blog post updated successfully",
    })
  } catch (error: any) {
    console.error("Error updating blog post:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const postId = Number.parseInt(id)

    if (isNaN(postId)) {
      return NextResponse.json({ success: false, error: "Invalid post ID" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM blog_posts WHERE id = ${postId} RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
