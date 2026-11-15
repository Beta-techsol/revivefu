import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    console.log("Fetching blog post with slug:", slug)

    // Get the blog post
    const posts = await sql`
      SELECT id, title, slug, content, excerpt, featured_image, author_name,
             category, published_at, views, is_featured, tags, meta_title, meta_description
      FROM blog_posts 
      WHERE slug = ${slug} AND status = 'published'
    `

    if (posts.length === 0) {
      return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 })
    }

    const post = posts[0]

    // Increment view count
    await sql`
      UPDATE blog_posts 
      SET views = views + 1 
      WHERE id = ${post.id}
    `

    // Get related posts (same category, excluding current post)
    const relatedPosts = await sql`
      SELECT id, title, slug, excerpt, featured_image, author_name, category, published_at
      FROM blog_posts 
      WHERE category = ${post.category} 
      AND id != ${post.id} 
      AND status = 'published'
      ORDER BY published_at DESC 
      LIMIT 3
    `

    return NextResponse.json({
      success: true,
      post: {
        ...post,
        views: post.views + 1, // Return updated view count
      },
      relatedPosts,
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
