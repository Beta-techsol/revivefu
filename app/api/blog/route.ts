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

    // Build the query dynamically using tagged templates
    let posts, countResult

    if (search && category && category !== "all" && featured) {
      // All filters
      const searchPattern = `%${search}%`
      countResult = await sql`
        SELECT COUNT(*) as total FROM blog_posts 
        WHERE status = 'published'
        AND (title ILIKE ${searchPattern} OR excerpt ILIKE ${searchPattern})
        AND category = ${category}
        AND is_featured = true
      `
      posts = await sql`
        SELECT id, title, slug, excerpt, featured_image, author_name, 
               category, published_at, views, is_featured, tags
        FROM blog_posts 
        WHERE status = 'published'
        AND (title ILIKE ${searchPattern} OR excerpt ILIKE ${searchPattern})
        AND category = ${category}
        AND is_featured = true
        ORDER BY published_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (search && category && category !== "all") {
      // Search + Category
      const searchPattern = `%${search}%`
      countResult = await sql`
        SELECT COUNT(*) as total FROM blog_posts 
        WHERE status = 'published'
        AND (title ILIKE ${searchPattern} OR excerpt ILIKE ${searchPattern})
        AND category = ${category}
      `
      posts = await sql`
        SELECT id, title, slug, excerpt, featured_image, author_name, 
               category, published_at, views, is_featured, tags
        FROM blog_posts 
        WHERE status = 'published'
        AND (title ILIKE ${searchPattern} OR excerpt ILIKE ${searchPattern})
        AND category = ${category}
        ORDER BY published_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (search && featured) {
      // Search + Featured
      const searchPattern = `%${search}%`
      countResult = await sql`
        SELECT COUNT(*) as total FROM blog_posts 
        WHERE status = 'published'
        AND (title ILIKE ${searchPattern} OR excerpt ILIKE ${searchPattern})
        AND is_featured = true
      `
      posts = await sql`
        SELECT id, title, slug, excerpt, featured_image, author_name, 
               category, published_at, views, is_featured, tags
        FROM blog_posts 
        WHERE status = 'published'
        AND (title ILIKE ${searchPattern} OR excerpt ILIKE ${searchPattern})
        AND is_featured = true
        ORDER BY published_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (category && category !== "all" && featured) {
      // Category + Featured
      countResult = await sql`
        SELECT COUNT(*) as total FROM blog_posts 
        WHERE status = 'published' AND category = ${category} AND is_featured = true
      `
      posts = await sql`
        SELECT id, title, slug, excerpt, featured_image, author_name, 
               category, published_at, views, is_featured, tags
        FROM blog_posts 
        WHERE status = 'published' AND category = ${category} AND is_featured = true
        ORDER BY published_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (search) {
      // Search only
      const searchPattern = `%${search}%`
      countResult = await sql`
        SELECT COUNT(*) as total FROM blog_posts 
        WHERE status = 'published'
        AND (title ILIKE ${searchPattern} OR excerpt ILIKE ${searchPattern})
      `
      posts = await sql`
        SELECT id, title, slug, excerpt, featured_image, author_name, 
               category, published_at, views, is_featured, tags
        FROM blog_posts 
        WHERE status = 'published'
        AND (title ILIKE ${searchPattern} OR excerpt ILIKE ${searchPattern})
        ORDER BY published_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (category && category !== "all") {
      // Category only
      countResult = await sql`
        SELECT COUNT(*) as total FROM blog_posts 
        WHERE status = 'published' AND category = ${category}
      `
      posts = await sql`
        SELECT id, title, slug, excerpt, featured_image, author_name, 
               category, published_at, views, is_featured, tags
        FROM blog_posts 
        WHERE status = 'published' AND category = ${category}
        ORDER BY published_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (featured) {
      // Featured only
      countResult = await sql`
        SELECT COUNT(*) as total FROM blog_posts 
        WHERE status = 'published' AND is_featured = true
      `
      posts = await sql`
        SELECT id, title, slug, excerpt, featured_image, author_name, 
               category, published_at, views, is_featured, tags
        FROM blog_posts 
        WHERE status = 'published' AND is_featured = true
        ORDER BY published_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      // No filters - just published posts
      countResult = await sql`
        SELECT COUNT(*) as total FROM blog_posts WHERE status = 'published'
      `
      posts = await sql`
        SELECT id, title, slug, excerpt, featured_image, author_name, 
               category, published_at, views, is_featured, tags
        FROM blog_posts 
        WHERE status = 'published'
        ORDER BY published_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    const total = Number.parseInt(countResult[0].total)
    console.log("Total published posts:", total)
    console.log("Published posts found:", posts.length)

    const response = {
      success: true,
      data: posts, // Note: using 'data' to match the frontend expectation
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit), // Note: using 'pages' to match frontend
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
