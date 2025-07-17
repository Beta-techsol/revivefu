import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const category = searchParams.get("category") || ""

    const offset = (page - 1) * limit

    // Build WHERE clause
    let whereClause = "WHERE 1=1"
    const params: any[] = []
    let paramIndex = 1

    if (search) {
      whereClause += ` AND (title ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    if (status) {
      whereClause += ` AND status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (category) {
      whereClause += ` AND category = $${paramIndex}`
      params.push(category)
      paramIndex++
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM blog_posts ${whereClause}`
    const countResult = await sql(countQuery, params)
    const total = Number.parseInt(countResult[0].total)

    // Get blog posts
    const query = `
      SELECT id, title, slug, excerpt, featured_image, author_name, status, 
             is_featured, category, published_at, created_at, views
      FROM blog_posts 
      ${whereClause}
      ORDER BY created_at DESC 
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      content,
      excerpt,
      featured_image,
      author_name = "Admin",
      status = "draft",
      is_featured = false,
      meta_title,
      meta_description,
      tags = [],
      category = "General",
    } = body

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Title, slug, and content are required" }, { status: 400 })
    }

    // Check if slug already exists
    const existingPost = await sql("SELECT id FROM blog_posts WHERE slug = $1", [slug])

    if (existingPost.length > 0) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
    }

    const published_at = status === "published" ? new Date().toISOString() : null

    const result = await sql(
      `
      INSERT INTO blog_posts (
        title, slug, content, excerpt, featured_image, author_name,
        status, is_featured, meta_title, meta_description, tags, category, published_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `,
      [
        title,
        slug,
        content,
        excerpt,
        featured_image,
        author_name,
        status,
        is_featured,
        meta_title,
        meta_description,
        JSON.stringify(tags),
        category,
        published_at,
      ],
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}
