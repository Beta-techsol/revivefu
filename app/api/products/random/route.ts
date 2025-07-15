import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "25")
    const tab = searchParams.get("tab") || "deals"

    // Create a daily seed based on current date and tab
    const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD format
    const seed = `${today}-${tab}`.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)

    console.log("Random Products API - Query params:", {
      limit,
      tab,
      seed,
      today,
    })

    // Get random products with a simpler approach
    const products = await sql`
      SELECT 
        p.id,
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
        p.room_type,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'active'
      ORDER BY RANDOM()
      LIMIT ${limit}
    `

    // Transform products to ensure proper data types
    const transformedProducts = products.map((product: any) => ({
      ...product,
      price: Number.parseFloat(product.price) || 0,
      compare_price: product.compare_price ? Number.parseFloat(product.compare_price) : null,
      average_rating: Number.parseFloat(product.average_rating) || 0,
      review_count: Number.parseInt(product.review_count) || 0,
      stock_quantity: Number.parseInt(product.stock_quantity) || 0,
      images: typeof product.images === "string" ? product.images : JSON.stringify(product.images || []),
      tags: typeof product.tags === "string" ? product.tags : JSON.stringify(product.tags || []),
      // Add some randomized flags for variety in the tabs
      isOnSale: Math.random() > 0.6, // 40% chance of being on sale
      discount: Math.floor(Math.random() * 30) + 10, // 10-40% discount
    }))

    console.log("Random Products API - Results:", {
      tab,
      productsCount: transformedProducts.length,
      seed,
    })

    return NextResponse.json({
      success: true,
      products: transformedProducts,
      tab,
      refreshDate: today,
    })
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
