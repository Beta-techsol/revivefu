import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log("Getting blog post by ID:", id)

    const posts = await sql`
      SELECT id, title, slug, content, excerpt, featured_image, author_name,
             category, status, is_featured, meta_title, meta_description, 
             tags, published_at, created_at, updated_at, views
      FROM blog_posts 
      WHERE id = ${Number.parseInt(id)}
    `

    if (posts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog post not found",
        },
        { status: 404 },
      )
    }

    console.log("Found blog post:", posts[0].title)

    return NextResponse.json({
      success: true,
      data: posts[0],
    })
  } catch (error: any) {
    console.error("Get blog post error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    console.log("Updating blog post:", id, body)

    const {
      title,
      slug,
      content,
      excerpt,
      featured_image,
      author_name,
      category,
      status,
      is_featured,
      meta_title,
      meta_description,
      tags,
    } = body

    const result = await sql`
      UPDATE blog_posts 
      SET title = ${title},
          slug = ${slug},
          content = ${content},
          excerpt = ${excerpt},
          featured_image = ${featured_image},
          author_name = ${author_name},
          category = ${category},
          status = ${status},
          is_featured = ${is_featured || false},
          meta_title = ${meta_title},
          meta_description = ${meta_description},
          tags = ${JSON.stringify(tags || [])},
          published_at = ${status === "published" ? new Date().toISOString() : null},
          updated_at = NOW()
      WHERE id = ${Number.parseInt(id)}
      RETURNING id, title, slug, status
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

    console.log("Updated blog post:", result[0])

    return NextResponse.json({
      success: true,
      data: result[0],
    })
  } catch (error: any) {
    console.error("Update blog post error:", error)
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
    console.log("Deleting blog post:", id)

    const result = await sql`
      DELETE FROM blog_posts 
      WHERE id = ${Number.parseInt(id)}
      RETURNING id, title
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

    console.log("Deleted blog post:", result[0])

    return NextResponse.json({
      success: true,
      data: result[0],
    })
  } catch (error: any) {
    console.error("Delete blog post error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
