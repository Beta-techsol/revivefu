import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "6")
    const category = searchParams.get("category") || ""
    const featured = searchParams.get("featured") === "true"

    const offset = (page - 1) * limit

    // Build WHERE clause for published posts only
    let whereClause = "WHERE status = 'published'"
    const params: any[] = []
    let paramIndex = 1

    if (category) {
      whereClause += ` AND category = $${paramIndex}`
      params.push(category)
      paramIndex++
    }

    if (featured) {
      whereClause += ` AND is_featured = true`
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM blog_posts ${whereClause}`
    const countResult = await sql(countQuery, params)
    const total = Number.parseInt(countResult[0].total)

    // Get blog posts
    const query = `
      SELECT id, title, slug, excerpt, featured_image, author_name, 
             category, published_at, views, is_featured
      FROM blog_posts 
      ${whereClause}
      ORDER BY published_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    const posts = await sql(query, [...params, limit, offset])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}
