import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    console.log("Getting blog post by slug:", params.slug)

    const post = await sql`
      SELECT 
        id, title, slug, content, excerpt, featured_image, author_name,
        category, status, is_featured, meta_title, meta_description, 
        tags, published_at, created_at, views
      FROM blog_posts 
      WHERE slug = ${params.slug} AND status = 'published'
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

    // Increment view count
    await sql`
      UPDATE blog_posts 
      SET views = COALESCE(views, 0) + 1 
      WHERE slug = ${params.slug}
    `

    // Get related posts (same category, excluding current post)
    const relatedPosts = await sql`
      SELECT id, title, slug, excerpt, featured_image, author_name, category, published_at
      FROM blog_posts 
      WHERE category = ${post[0].category} 
        AND slug != ${params.slug} 
        AND status = 'published'
      ORDER BY published_at DESC 
      LIMIT 3
    `

    console.log("Found post:", post[0].title)
    console.log("Related posts:", relatedPosts.length)

    return NextResponse.json({
      success: true,
      post: post[0],
      relatedPosts,
    })
  } catch (error: any) {
    console.error("Error fetching blog post:", error)
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
