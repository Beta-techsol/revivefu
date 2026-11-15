import { type NextRequest, NextResponse } from "next/server"
import { unstable_noStore as noStore } from "next/cache"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
}

export async function GET(request: NextRequest) {
  noStore()
  try {
    const { searchParams } = new URL(request.url)
    const tab = searchParams.get("tab") || "deals"
    const limit = Number.parseInt(searchParams.get("limit") || "25")

    console.log("Random Products API - Query params:", { tab, limit })

    let whereCondition = "p.status = 'active'"
    let orderBy = "RANDOM()"

    // Determine filter based on tab
    switch (tab) {
      case "deals":
        whereCondition += " AND p.is_deal_of_day = true"
        break
      case "latest":
        whereCondition += " AND p.is_latest = true"
        orderBy = "p.created_at DESC"
        break
      case "trending":
        whereCondition += " AND p.is_trending = true"
        break
      case "hot":
        whereCondition += " AND p.is_hot_selling = true"
        break
      case "carousel":
        whereCondition += " AND p.is_best_seller = true"
        break
      default:
        break
    }

    // Main query with slug
    const productsQuery = `
      SELECT 
        p.id,
        p.slug,                                -- ✅ added
        p.name,
        p.price::numeric as price,
        p.compare_price::numeric as compare_price,
        p.description,
        p.short_description,
        p.sku,
        p.status,
        p.stock_quantity,
        p.images,
        p.tags,
        p.material,
        p.color,
        p.brand,
        p.average_rating::numeric as average_rating,
        p.review_count,
        p.is_featured,
        p.is_trending,
        p.is_best_seller,
        p.is_hot_selling,
        p.is_deal_of_day,
        p.is_latest,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.slug as category_slug,
        c.id as category_id,
        rt.name as room_type_name,
        rt.slug as room_type_slug,
        rt.id as room_type_id
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN room_type rt ON p.room_type_id = rt.id
      WHERE ${whereCondition}
      ORDER BY ${orderBy}
      LIMIT ${limit}
    `

    console.log("Random products query:", productsQuery)
    const products = await sql`${sql.unsafe(productsQuery)}`

    // If not enough products, fallback query
    if (products.length < Math.min(limit, 5) && tab !== "carousel") {
      console.log(`Not enough products for tab ${tab}, fetching random products`)

      const fallbackQuery = `
        SELECT 
          p.id,
          p.slug,                              -- ✅ added
          p.name,
          p.price::numeric as price,
          p.compare_price::numeric as compare_price,
          p.description,
          p.short_description,
          p.sku,
          p.status,
          p.stock_quantity,
          p.images,
          p.tags,
          p.material,
          p.color,
          p.brand,
          p.average_rating::numeric as average_rating,
          p.review_count,
          p.is_featured,
          p.is_trending,
          p.is_best_seller,
          p.is_hot_selling,
          p.is_deal_of_day,
          p.is_latest,
          p.created_at,
          p.updated_at,
          c.name as category_name,
          c.slug as category_slug,
          c.id as category_id,
          rt.name as room_type_name,
          rt.slug as room_type_slug,
          rt.id as room_type_id
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN room_type rt ON p.room_type_id = rt.id
        WHERE p.status = 'active'
        ORDER BY RANDOM()
        LIMIT ${limit}
      `

      const fallbackProducts = await sql`${sql.unsafe(fallbackQuery)}`

      const transformedFallbackProducts = fallbackProducts.map((product: any) => ({
        ...product,
        price: Number.parseFloat(product.price) || 0,
        compare_price: product.compare_price ? Number.parseFloat(product.compare_price) : null,
        average_rating: Number.parseFloat(product.average_rating) || 0,
        review_count: Number.parseInt(product.review_count) || 0,
        stock_quantity: Number.parseInt(product.stock_quantity) || 0,
        images: product.images || "[]",
        tags: product.tags || "[]",
        room_type: product.room_type_name,
        category_name: product.category_name || "",
      }))

      console.log("Random Products API - Fallback Results:", {
        tab,
        productsCount: transformedFallbackProducts.length,
        sampleProduct: transformedFallbackProducts[0]
          ? {
              id: transformedFallbackProducts[0].id,
              slug: transformedFallbackProducts[0].slug, // ✅ check slug
              name: transformedFallbackProducts[0].name,
              images: transformedFallbackProducts[0].images,
            }
          : null,
      })

      return NextResponse.json({
        success: true,
        products: transformedFallbackProducts,
        tab,
        fallback: true,
      }, { headers: noStoreHeaders })
    }

    // Transform products
    const transformedProducts = products.map((product: any) => ({
      ...product,
      price: Number.parseFloat(product.price) || 0,
      compare_price: product.compare_price ? Number.parseFloat(product.compare_price) : null,
      average_rating: Number.parseFloat(product.average_rating) || 0,
      review_count: Number.parseInt(product.review_count) || 0,
      stock_quantity: Number.parseInt(product.stock_quantity) || 0,
      images: product.images || "[]",
      tags: product.tags || "[]",
      room_type: product.room_type_name,
      category_name: product.category_name || "",
    }))

    console.log("Random Products API - Results:", {
      tab,
      productsCount: transformedProducts.length,
      sampleProduct: transformedProducts[0]
        ? {
            id: transformedProducts[0].id,
            slug: transformedProducts[0].slug, // ✅ check slug
            name: transformedProducts[0].name,
            images: transformedProducts[0].images,
          }
        : null,
    })

    return NextResponse.json({
      success: true,
      products: transformedProducts,
      tab,
    }, { headers: noStoreHeaders })
  } catch (error) {
    console.error("Error in random products API:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch random products",
      },
      { status: 500 },
    )
  }
}
