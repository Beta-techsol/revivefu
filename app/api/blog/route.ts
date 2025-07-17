import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "6")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""

    console.log("Public blog API params:", { page, limit, search, category })

    const offset = (page - 1) * limit

    // Build WHERE conditions - only published posts
    const whereConditions = ["status = 'published'"]
    let searchCondition = ""

    if (search) {
      searchCondition = `AND (title ILIKE '%${search}%' OR excerpt ILIKE '%${search}%' OR content ILIKE '%${search}%')`
    }

    if (category && category !== "all") {
      whereConditions.push(`category = '${category}'`)
    }

    const whereClause = `WHERE ${whereConditions.join(" AND ")} ${searchCondition}`

    // Get total count
    const countQuery = `SELECT COUNT(*) as count FROM blog_posts ${whereClause}`
    console.log("Count query:", countQuery)

    const totalResult = await sql.query(countQuery)
    const total = Number.parseInt(totalResult[0].count)

    // Get posts
    const postsQuery = `
      SELECT id, title, slug, excerpt, featured_image, author_name,
             category, published_at, views, is_featured, tags
      FROM blog_posts 
      ${whereClause}
      ORDER BY published_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `
    console.log("Posts query:", postsQuery)

    const posts = await sql.query(postsQuery)

    console.log("Found published posts:", posts.length)
    console.log("Total published posts:", total)

    return NextResponse.json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Public blog API error:", error)
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
