import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const category = searchParams.get("category") || ""

    console.log("Admin blog API params:", { page, limit, search, status, category })

    const offset = (page - 1) * limit

    // Build WHERE conditions
    const whereConditions = []
    let searchCondition = ""

    if (search) {
      searchCondition = `AND (title ILIKE '%${search}%' OR content ILIKE '%${search}%' OR author_name ILIKE '%${search}%')`
    }

    if (status) {
      whereConditions.push(`status = '${status}'`)
    }

    if (category) {
      whereConditions.push(`category = '${category}'`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""
    const fullWhereClause = whereClause + " " + searchCondition

    // Get total count
    const countQuery = `SELECT COUNT(*) as count FROM blog_posts ${fullWhereClause}`
    console.log("Count query:", countQuery)

    const totalResult = await sql.query(countQuery)
    const total = Number.parseInt(totalResult[0].count)

    // Get posts
    const postsQuery = `
      SELECT id, title, slug, excerpt, featured_image, author_name,
             category, status, is_featured, published_at, created_at, views
      FROM blog_posts 
      ${fullWhereClause}
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `
    console.log("Posts query:", postsQuery)

    const posts = await sql.query(postsQuery)

    console.log("Found posts:", posts.length)
    console.log("Total posts:", total)

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
    console.error("Admin blog API error:", error)
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Creating new blog post:", body)

    const {
      title,
      slug,
      content,
      excerpt,
      featured_image,
      author_name,
      category,
      status,
      is_featured,
      meta_title,
      meta_description,
      tags,
    } = body

    // Generate slug if not provided
    const finalSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

    const result = await sql`
      INSERT INTO blog_posts (
        title, slug, content, excerpt, featured_image, author_name,
        category, status, is_featured, meta_title, meta_description, tags,
        published_at, created_at, updated_at
      ) VALUES (
        ${title}, ${finalSlug}, ${content}, ${excerpt}, ${featured_image}, ${author_name},
        ${category}, ${status}, ${is_featured || false}, ${meta_title}, ${meta_description}, ${JSON.stringify(tags || [])},
        ${status === "published" ? new Date().toISOString() : null},
        NOW(), NOW()
      )
      RETURNING id, title, slug, status
    `

    console.log("Created blog post:", result[0])

    return NextResponse.json({
      success: true,
      data: result[0],
    })
  } catch (error: any) {
    console.error("Create blog post error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
