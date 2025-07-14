import type { NextRequest } from "next/server"
import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const featured = searchParams.get("featured") === "true"
    const trending = searchParams.get("trending") === "true"
    const best_seller = searchParams.get("best_seller") === "true"
    const room_type = searchParams.get("room_type") || ""

    const offset = (page - 1) * limit

    console.log("Fetching public products with params:", {
      page,
      limit,
      search,
      category,
      featured,
      trending,
      best_seller,
      room_type,
    })

    let products
    let totalResult

    // Build query based on filters
    if (search && category && category !== "all") {
      products = await sql`
        SELECT 
          p.id, p.name, p.slug, p.description, p.short_description, p.sku, p.price, p.compare_price, p.cost,
          p.category_id, p.stock_quantity, p.track_quantity, p.continue_selling, p.weight, p.dimensions,
          p.material, p.color, p.brand, p.status, p.images, p.primary_image_index, p.tags,
          p.is_featured, p.is_trending, p.is_best_seller, p.is_hot_selling, p.is_deal_of_day, p.is_latest,
          p.room_type, p.meta_title, p.meta_description, p.average_rating, p.review_count,
          p.created_at, p.updated_at, COALESCE(c.name, 'Uncategorized') as category_name, c.slug as category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active'
          AND (p.name ILIKE ${`%${search}%`} OR p.description ILIKE ${`%${search}%`})
          AND c.slug = ${category}
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      totalResult = await sql`
        SELECT COUNT(*) as total
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active'
          AND (p.name ILIKE ${`%${search}%`} OR p.description ILIKE ${`%${search}%`})
          AND c.slug = ${category}
      `
    } else if (search) {
      products = await sql`
        SELECT 
          p.id, p.name, p.slug, p.description, p.short_description, p.sku, p.price, p.compare_price, p.cost,
          p.category_id, p.stock_quantity, p.track_quantity, p.continue_selling, p.weight, p.dimensions,
          p.material, p.color, p.brand, p.status, p.images, p.primary_image_index, p.tags,
          p.is_featured, p.is_trending, p.is_best_seller, p.is_hot_selling, p.is_deal_of_day, p.is_latest,
          p.room_type, p.meta_title, p.meta_description, p.average_rating, p.review_count,
          p.created_at, p.updated_at, COALESCE(c.name, 'Uncategorized') as category_name, c.slug as category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active'
          AND (p.name ILIKE ${`%${search}%`} OR p.description ILIKE ${`%${search}%`})
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      totalResult = await sql`
        SELECT COUNT(*) as total
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active'
          AND (p.name ILIKE ${`%${search}%`} OR p.description ILIKE ${`%${search}%`})
      `
    } else if (category && category !== "all") {
      products = await sql`
        SELECT 
          p.id, p.name, p.slug, p.description, p.short_description, p.sku, p.price, p.compare_price, p.cost,
          p.category_id, p.stock_quantity, p.track_quantity, p.continue_selling, p.weight, p.dimensions,
          p.material, p.color, p.brand, p.status, p.images, p.primary_image_index, p.tags,
          p.is_featured, p.is_trending, p.is_best_seller, p.is_hot_selling, p.is_deal_of_day, p.is_latest,
          p.room_type, p.meta_title, p.meta_description, p.average_rating, p.review_count,
          p.created_at, p.updated_at, COALESCE(c.name, 'Uncategorized') as category_name, c.slug as category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active' AND c.slug = ${category}
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      totalResult = await sql`
        SELECT COUNT(*) as total
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active' AND c.slug = ${category}
      `
    } else if (featured) {
      products = await sql`
        SELECT 
          p.id, p.name, p.slug, p.description, p.short_description, p.sku, p.price, p.compare_price, p.cost,
          p.category_id, p.stock_quantity, p.track_quantity, p.continue_selling, p.weight, p.dimensions,
          p.material, p.color, p.brand, p.status, p.images, p.primary_image_index, p.tags,
          p.is_featured, p.is_trending, p.is_best_seller, p.is_hot_selling, p.is_deal_of_day, p.is_latest,
          p.room_type, p.meta_title, p.meta_description, p.average_rating, p.review_count,
          p.created_at, p.updated_at, COALESCE(c.name, 'Uncategorized') as category_name, c.slug as category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active' AND p.is_featured = true
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      totalResult = await sql`
        SELECT COUNT(*) as total
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active' AND p.is_featured = true
      `
    } else if (trending) {
      products = await sql`
        SELECT 
          p.id, p.name, p.slug, p.description, p.short_description, p.sku, p.price, p.compare_price, p.cost,
          p.category_id, p.stock_quantity, p.track_quantity, p.continue_selling, p.weight, p.dimensions,
          p.material, p.color, p.brand, p.status, p.images, p.primary_image_index, p.tags,
          p.is_featured, p.is_trending, p.is_best_seller, p.is_hot_selling, p.is_deal_of_day, p.is_latest,
          p.room_type, p.meta_title, p.meta_description, p.average_rating, p.review_count,
          p.created_at, p.updated_at, COALESCE(c.name, 'Uncategorized') as category_name, c.slug as category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active' AND p.is_trending = true
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      totalResult = await sql`
        SELECT COUNT(*) as total
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active' AND p.is_trending = true
      `
    } else if (best_seller) {
      products = await sql`
        SELECT 
          p.id, p.name, p.slug, p.description, p.short_description, p.sku, p.price, p.compare_price, p.cost,
          p.category_id, p.stock_quantity, p.track_quantity, p.continue_selling, p.weight, p.dimensions,
          p.material, p.color, p.brand, p.status, p.images, p.primary_image_index, p.tags,
          p.is_featured, p.is_trending, p.is_best_seller, p.is_hot_selling, p.is_deal_of_day, p.is_latest,
          p.room_type, p.meta_title, p.meta_description, p.average_rating, p.review_count,
          p.created_at, p.updated_at, COALESCE(c.name, 'Uncategorized') as category_name, c.slug as category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active' AND p.is_best_seller = true
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      totalResult = await sql`
        SELECT COUNT(*) as total
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active' AND p.is_best_seller = true
      `
    } else if (room_type) {
      products = await sql`
        SELECT 
          p.id, p.name, p.slug, p.description, p.short_description, p.sku, p.price, p.compare_price, p.cost,
          p.category_id, p.stock_quantity, p.track_quantity, p.continue_selling, p.weight, p.dimensions,
          p.material, p.color, p.brand, p.status, p.images, p.primary_image_index, p.tags,
          p.is_featured, p.is_trending, p.is_best_seller, p.is_hot_selling, p.is_deal_of_day, p.is_latest,
          p.room_type, p.meta_title, p.meta_description, p.average_rating, p.review_count,
          p.created_at, p.updated_at, COALESCE(c.name, 'Uncategorized') as category_name, c.slug as category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active' AND p.room_type = ${room_type}
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      totalResult = await sql`
        SELECT COUNT(*) as total
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active' AND p.room_type = ${room_type}
      `
    } else {
      // Default query - all active products
      products = await sql`
        SELECT 
          p.id, p.name, p.slug, p.description, p.short_description, p.sku, p.price, p.compare_price, p.cost,
          p.category_id, p.stock_quantity, p.track_quantity, p.continue_selling, p.weight, p.dimensions,
          p.material, p.color, p.brand, p.status, p.images, p.primary_image_index, p.tags,
          p.is_featured, p.is_trending, p.is_best_seller, p.is_hot_selling, p.is_deal_of_day, p.is_latest,
          p.room_type, p.meta_title, p.meta_description, p.average_rating, p.review_count,
          p.created_at, p.updated_at, COALESCE(c.name, 'Uncategorized') as category_name, c.slug as category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active'
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      totalResult = await sql`
        SELECT COUNT(*) as total
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active'
      `
    }

    const total = Number.parseInt(totalResult[0]?.total || "0")

    console.log("Found public products:", products.length)
    console.log("Total public count:", total)

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Error fetching public products:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
