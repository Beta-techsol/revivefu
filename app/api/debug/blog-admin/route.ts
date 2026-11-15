import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    console.log("=== DEBUG: Admin Blog API ===")

    // Test basic connection
    const connectionTest = await sql`SELECT NOW() as current_time`
    console.log("Connection test:", connectionTest)

    // Check if table exists and structure
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'blog_posts'
      )
    `
    console.log("Table exists:", tableCheck)

    // Get all posts with full details
    const allPosts = await sql`
      SELECT id, title, slug, content, excerpt, featured_image, author_name,
             category, status, is_featured, meta_title, meta_description, 
             tags, published_at, created_at, updated_at, views
      FROM blog_posts 
      ORDER BY created_at DESC
    `
    console.log("All posts count:", allPosts.length)
    console.log("First post:", allPosts[0])

    // Test pagination query
    const paginatedPosts = await sql`
      SELECT id, title, slug, excerpt, featured_image, author_name,
             category, status, is_featured, published_at, views
      FROM blog_posts 
      ORDER BY created_at DESC 
      LIMIT 10 OFFSET 0
    `
    console.log("Paginated posts count:", paginatedPosts.length)

    // Test count query
    const totalCount = await sql`SELECT COUNT(*) as count FROM blog_posts`
    console.log("Total count:", totalCount)

    return NextResponse.json({
      success: true,
      debug: {
        connectionTest,
        tableExists: tableCheck,
        allPostsCount: allPosts.length,
        firstPost: allPosts[0] || null,
        paginatedPostsCount: paginatedPosts.length,
        totalCount: totalCount[0],
        samplePosts: allPosts.slice(0, 3),
      },
    })
  } catch (error: any) {
    console.error("Debug admin blog error:", error)
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
