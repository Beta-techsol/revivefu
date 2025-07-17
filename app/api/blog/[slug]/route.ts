import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    // Get the blog post
    const result = await sql(`SELECT * FROM blog_posts WHERE slug = $1 AND status = 'published'`, [slug])

    if (result.length === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    const post = result[0]

    // Increment view count
    await sql("UPDATE blog_posts SET views = views + 1 WHERE id = $1", [post.id])

    // Get related posts (same category, excluding current post)
    const relatedPosts = await sql(
      `SELECT id, title, slug, excerpt, featured_image, author_name, published_at
       FROM blog_posts 
       WHERE category = $1 AND id != $2 AND status = 'published'
       ORDER BY published_at DESC 
       LIMIT 3`,
      [post.category, post.id],
    )

    return NextResponse.json({
      post: { ...post, views: post.views + 1 },
      relatedPosts,
    })
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}
