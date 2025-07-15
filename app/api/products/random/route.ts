import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tab = searchParams.get("tab") || "deals"
    const limit = Number.parseInt(searchParams.get("limit") || "25")

    let whereClause = ""
    const orderClause = "ORDER BY RANDOM()"

    // Set conditions based on tab
    switch (tab) {
      case "deals":
        whereClause = "WHERE p.is_deal_of_day = true"
        break
      case "latest":
        whereClause = "WHERE p.is_latest = true"
        break
      case "trending":
        whereClause = "WHERE p.is_trending = true"
        break
      case "hot":
        whereClause = "WHERE p.is_hot_selling = true"
        break
      case "carousel":
        whereClause = "WHERE p.is_best_seller = true"
        break
      default:
        whereClause = ""
    }

    const query = `
      SELECT 
        p.id,
        p.name,
        p.price,
        p.compare_price,
        p.images,
        p.description,
        p.short_description,
        p.stock_quantity,
        p.average_rating,
        p.review_count,
        p.is_featured,
        p.is_trending,
        p.is_best_seller,
        p.is_hot_selling,
        p.is_deal_of_day,
        p.is_latest,
        p.material,
        p.color,
        p.brand,
        p.tags,
        c.name as category_name,
        rt.name as room_type_name,
        rt.slug as room_type_slug,
        p.room_type_id
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN room_type rt ON p.room_type_id = rt.id
      ${whereClause}
      AND p.stock_quantity > 0
      ${orderClause}
      LIMIT $1
    `

    const products = await sql(query, [limit])

    // Transform products with proper image handling
    const transformedProducts = products.map((product: any) => {
      let images = []

      // Parse images properly
      if (product.images) {
        try {
          if (typeof product.images === "string") {
            images = JSON.parse(product.images)
          } else if (Array.isArray(product.images)) {
            images = product.images
          }
        } catch (e) {
          // If parsing fails, treat as single image
          images = [product.images]
        }
      }

      // Ensure we have valid images array
      if (!Array.isArray(images) || images.length === 0) {
        images = ["/placeholder.svg?height=400&width=400"]
      }

      return {
        ...product,
        images: images,
        room_type: product.room_type_name || "",
        room_type_slug: product.room_type_slug || "",
        category_name: product.category_name || "",
        average_rating: product.average_rating || 0,
        review_count: product.review_count || 0,
      }
    })

    return NextResponse.json({
      success: true,
      products: transformedProducts,
      count: transformedProducts.length,
    })
  } catch (error) {
    console.error("Error fetching random products:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}
