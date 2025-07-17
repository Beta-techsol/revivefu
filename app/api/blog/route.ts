import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    console.log("Public blog API called")

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "6")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const featured = searchParams.get("featured") === "true"

    console.log("Query params:", { page, limit, search, category, featured })

    const offset = (page - 1) * limit

    // Build WHERE clause for published posts only
    const whereConditions: string[] = ["status = 'published'"]
    const params: any[] = []
    let paramIndex = 1

    if (search) {
      whereConditions.push(`(title ILIKE $${paramIndex} OR excerpt ILIKE $${paramIndex})`)
      params.push(`%${search}%`)
      paramIndex++
    }

    if (category && category !== "all") {
      whereConditions.push(`category = $${paramIndex}`)
      params.push(category)
      paramIndex++
    }

    if (featured) {
      whereConditions.push(`is_featured = true`)
    }

    const whereClause = `WHERE ${whereConditions.join(" AND ")}`

    console.log("WHERE clause:", whereClause)
    console.log("Params:", params)

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM blog_posts ${whereClause}`
    console.log("Count query:", countQuery)

    const countResult = await sql(countQuery, params)
    const total = Number.parseInt(countResult[0].total)
    console.log("Total published posts:", total)

    // Get blog posts
    const query = `
      SELECT 
        id, title, slug, excerpt, featured_image, author_name, 
        category, published_at, views, is_featured, tags
      FROM blog_posts 
      ${whereClause}
      ORDER BY published_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    console.log("Main query:", query)
    console.log("Final params:", [...params, limit, offset])

    const posts = await sql(query, [...params, limit, offset])
    console.log("Published posts found:", posts.length)

    const response = {
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }

    console.log("Response:", response)
    return NextResponse.json(response)
  } catch (error: any) {
    console.error("Error in public blog API:", error)
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
