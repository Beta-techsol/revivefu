import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    console.log("=== DEBUG: Public Blog API ===")

    // Test published posts query
    const publishedPosts = await sql`
      SELECT id, title, slug, excerpt, featured_image, author_name,
             category, published_at, views, is_featured, tags
      FROM blog_posts 
      WHERE status = 'published'
      ORDER BY published_at DESC
    `
    console.log("Published posts count:", publishedPosts.length)
    console.log("First published post:", publishedPosts[0])

    // Test with pagination
    const paginatedPublished = await sql`
      SELECT id, title, slug, excerpt, featured_image, author_name,
             category, published_at, views, is_featured, tags
      FROM blog_posts 
      WHERE status = 'published'
      ORDER BY published_at DESC 
      LIMIT 6 OFFSET 0
    `
    console.log("Paginated published posts:", paginatedPublished.length)

    // Test count of published posts
    const publishedCount = await sql`
      SELECT COUNT(*) as count 
      FROM blog_posts 
      WHERE status = 'published'
    `
    console.log("Published count:", publishedCount)

    return NextResponse.json({
      success: true,
      debug: {
        publishedPostsCount: publishedPosts.length,
        firstPublishedPost: publishedPosts[0] || null,
        paginatedCount: paginatedPublished.length,
        publishedCount: publishedCount[0],
        samplePublishedPosts: publishedPosts.slice(0, 3),
      },
    })
  } catch (error: any) {
    console.error("Debug public blog error:", error)
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
