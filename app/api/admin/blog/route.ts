import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    console.log("Admin blog API called")

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const category = searchParams.get("category") || ""

    console.log("Query params:", { page, limit, search, status, category })

    const offset = (page - 1) * limit

    // Build the query dynamically using tagged templates
    let posts, countResult

    if (search && status && status !== "all" && category && category !== "all") {
      // All filters
      const searchPattern = `%${search}%`
      countResult = await sql`
        SELECT COUNT(*) as total FROM blog_posts 
        WHERE (title ILIKE ${searchPattern} OR content ILIKE ${searchPattern} OR author_name ILIKE ${searchPattern})
        AND status = ${status}
        AND category = ${category}
      `
      posts = await sql`
        SELECT id, title, slug, excerpt, featured_image, author_name, status, 
               is_featured, category, published_at, created_at, views
        FROM blog_posts 
        WHERE (title ILIKE ${searchPattern} OR content ILIKE ${searchPattern} OR author_name ILIKE ${searchPattern})
        AND status = ${status}
        AND category = ${category}
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (search && status && status !== "all") {
      // Search + Status
      const searchPattern = `%${search}%`
      countResult = await sql`
        SELECT COUNT(*) as total FROM blog_posts 
        WHERE (title ILIKE ${searchPattern} OR content ILIKE ${searchPattern} OR author_name ILIKE ${searchPattern})
        AND status = ${status}
      `
      posts = await sql`
        SELECT id, title, slug, excerpt, featured_image, author_name, status, 
               is_featured, category, published_at, created_at, views
        FROM blog_posts 
        WHERE (title ILIKE ${searchPattern} OR content ILIKE ${searchPattern} OR author_name ILIKE ${searchPattern})
        AND status = ${status}
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (search && category && category !== "all") {
      // Search + Category
      const searchPattern = `%${search}%`
      countResult = await sql`
        SELECT COUNT(*) as total FROM blog_posts 
        WHERE (title ILIKE ${searchPattern} OR content ILIKE ${searchPattern} OR author_name ILIKE ${searchPattern})
        AND category = ${category}
      `
      posts = await sql`
        SELECT id, title, slug, excerpt, featured_image, author_name, status, 
               is_featured, category, published_at, created_at, views
        FROM blog_posts 
        WHERE (title ILIKE ${searchPattern} OR content ILIKE ${searchPattern} OR author_name ILIKE ${searchPattern})
        AND category = ${category}
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (status && status !== "all" && category && category !== "all") {
      // Status + Category
      countResult = await sql`
        SELECT COUNT(*) as total FROM blog_posts 
        WHERE status = ${status} AND category = ${category}
      `
      posts = await sql`
        SELECT id, title, slug, excerpt, featured_image, author_name, status, 
               is_featured, category, published_at, created_at, views
        FROM blog_posts 
        WHERE status = ${status} AND category = ${category}
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (search) {
      // Search only
      const searchPattern = `%${search}%`
      countResult = await sql`
        SELECT COUNT(*) as total FROM blog_posts 
        WHERE title ILIKE ${searchPattern} OR content ILIKE ${searchPattern} OR author_name ILIKE ${searchPattern}
      `
      posts = await sql`
        SELECT id, title, slug, excerpt, featured_image, author_name, status, 
               is_featured, category, published_at, created_at, views
        FROM blog_posts 
        WHERE title ILIKE ${searchPattern} OR content ILIKE ${searchPattern} OR author_name ILIKE ${searchPattern}
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (status && status !== "all") {
      // Status only
      countResult = await sql`
        SELECT COUNT(*) as total FROM blog_posts WHERE status = ${status}
      `
      posts = await sql`
        SELECT id, title, slug, excerpt, featured_image, author_name, status, 
               is_featured, category, published_at, created_at, views
        FROM blog_posts 
        WHERE status = ${status}
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (category && category !== "all") {
      // Category only
      countResult = await sql`
        SELECT COUNT(*) as total FROM blog_posts WHERE category = ${category}
      `
      posts = await sql`
        SELECT id, title, slug, excerpt, featured_image, author_name, status, 
               is_featured, category, published_at, created_at, views
        FROM blog_posts 
        WHERE category = ${category}
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      // No filters
      countResult = await sql`SELECT COUNT(*) as total FROM blog_posts`
      posts = await sql`
        SELECT id, title, slug, excerpt, featured_image, author_name, status, 
               is_featured, category, published_at, created_at, views
        FROM blog_posts 
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    const total = Number.parseInt(countResult[0].total)
    console.log("Total count:", total)
    console.log("Posts found:", posts.length)

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
    console.error("Error in admin blog API:", error)
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
    console.log("Creating new blog post")

    const body = await request.json()
    console.log("Request body:", body)

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
      return NextResponse.json(
        {
          success: false,
          error: "Title, slug, and content are required",
        },
        { status: 400 },
      )
    }

    // Check if slug already exists
    const existingPost = await sql`SELECT id FROM blog_posts WHERE slug = ${slug}`
    console.log("Existing post check:", existingPost)

    if (existingPost.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug already exists",
        },
        { status: 400 },
      )
    }

    const published_at = status === "published" ? new Date().toISOString() : null
    const tagsJson = JSON.stringify(tags)

    const result = await sql`
      INSERT INTO blog_posts (
        title, slug, content, excerpt, featured_image, author_name,
        status, is_featured, meta_title, meta_description, tags, category, published_at
      ) VALUES (
        ${title}, ${slug}, ${content}, ${excerpt}, ${featured_image}, ${author_name},
        ${status}, ${is_featured}, ${meta_title}, ${meta_description}, 
        ${tagsJson}, ${category}, ${published_at}
      )
      RETURNING *
    `

    console.log("Created post:", result[0])

    return NextResponse.json(
      {
        success: true,
        post: result[0],
        message: "Blog post created successfully",
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Error creating blog post:", error)
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
