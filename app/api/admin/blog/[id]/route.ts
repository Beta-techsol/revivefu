import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    console.log("Getting blog post by ID:", id)

    const post = await sql`
      SELECT * FROM blog_posts WHERE id = ${id}
    `

    if (post.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog post not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      post: post[0],
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
    const id = Number.parseInt(params.id)
    const body = await request.json()
    console.log("Updating blog post:", id, body)

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

    // Check if slug already exists (excluding current post)
    const existingPost = await sql`
      SELECT id FROM blog_posts WHERE slug = ${slug} AND id != ${id}
    `

    if (existingPost.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug already exists",
        },
        { status: 400 },
      )
    }

    const published_at = status === "published" ? new Date().toISOString() : null

    const result = await sql`
      UPDATE blog_posts SET
        title = ${title},
        slug = ${slug},
        content = ${content},
        excerpt = ${excerpt},
        featured_image = ${featured_image},
        author_name = ${author_name},
        status = ${status},
        is_featured = ${is_featured},
        meta_title = ${meta_title},
        meta_description = ${meta_description},
        tags = ${JSON.stringify(tags)},
        category = ${category},
        published_at = ${published_at},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog post not found",
        },
        { status: 404 },
      )
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
    const id = Number.parseInt(params.id)
    console.log("Deleting blog post:", id)

    const result = await sql`
      DELETE FROM blog_posts WHERE id = ${id} RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog post not found",
        },
        { status: 404 },
      )
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
