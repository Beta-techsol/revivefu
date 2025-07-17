import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Test database connection
    const connectionTest = await sql`SELECT NOW() as current_time`

    // Check if blog_posts table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'blog_posts'
      )
    `

    // Get table structure
    const tableStructure = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'blog_posts'
      ORDER BY ordinal_position
    `

    // Count total posts
    const totalPosts = await sql`SELECT COUNT(*) FROM blog_posts`

    // Get sample posts
    const samplePosts = await sql`
      SELECT id, title, slug, status, author_name, category, created_at
      FROM blog_posts 
      ORDER BY created_at DESC 
      LIMIT 5
    `

    return NextResponse.json({
      success: true,
      debug: {
        connectionTest,
        tableExists,
        tableStructure,
        totalPosts,
        samplePosts,
        databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
      },
    })
  } catch (error: any) {
    console.error("Debug API error:", error)
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
