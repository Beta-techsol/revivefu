import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tab = searchParams.get("tab") || "deals"
    const limit = Number.parseInt(searchParams.get("limit") || "25")

    let whereClause = ""
    let orderClause = "ORDER BY RANDOM()"

    // Set conditions based on tab
    switch (tab) {
      case "deals":
        whereClause = "WHERE p.is_deal_of_day = true OR p.compare_price > p.price"
        break
      case "latest":
        whereClause = "WHERE p.is_latest = true"
        orderClause = "ORDER BY p.created_at DESC"
        break
      case "trending":
        whereClause = "WHERE p.is_trending = true OR p.review_count > 10"
        break
      case "hot":
        whereClause = "WHERE p.is_hot_selling = true OR p.is_best_seller = true"
        break
      case "carousel":
        whereClause = "WHERE p.is_best_seller = true OR p.is_featured = true"
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
        p.tags,
        p.material,
        p.color,
        p.brand,
        c.name as category_name,
        rt.name as room_type_name,
        rt.slug as room_type_slug,
        p.room_type_id,
        p.created_at
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
      // Parse images properly
      let productImages: string[] = []
      if (product.images) {
        try {
          if (typeof product.images === "string") {
            const parsed = JSON.parse(product.images)
            productImages = Array.isArray(parsed) ? parsed : [product.images]
          } else if (Array.isArray(product.images)) {
            productImages = product.images
          }
        } catch {
          productImages = [product.images]
        }
      }

      // Ensure we have at least placeholder images
      if (productImages.length === 0) {
        productImages = ["/placeholder.svg?height=400&width=400"]
      }

      // Parse tags properly
      let productTags: string[] = []
      if (product.tags) {
        try {
          if (typeof product.tags === "string") {
            const parsed = JSON.parse(product.tags)
            productTags = Array.isArray(parsed) ? parsed : [product.tags]
          } else if (Array.isArray(product.tags)) {
            productTags = product.tags
          }
        } catch {
          productTags = [product.tags]
        }
      }

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        compare_price: product.compare_price,
        originalPrice: product.compare_price,
        images: productImages,
        image: productImages[0] || "/placeholder.svg?height=400&width=400",
        hoverImage: productImages[1] || productImages[0] || "/placeholder.svg?height=400&width=400",
        description: product.description || product.short_description || "",
        stock_quantity: product.stock_quantity,
        average_rating: product.average_rating || 0,
        review_count: product.review_count || 0,
        rating: product.average_rating || 0,
        is_featured: product.is_featured,
        is_trending: product.is_trending,
        is_best_seller: product.is_best_seller,
        is_hot_selling: product.is_hot_selling,
        is_deal_of_day: product.is_deal_of_day,
        is_latest: product.is_latest,
        tags: productTags,
        material: product.material || "",
        color: product.color || "",
        brand: product.brand || "",
        category_name: product.category_name || "",
        room_type_name: product.room_type_name || "",
        room_type_slug: product.room_type_slug || "",
        room_type_id: product.room_type_id,
        room_type: product.room_type_name || "", // For compatibility
        isSoldOut: product.stock_quantity === 0,
        isOnSale: product.compare_price && product.compare_price > product.price,
        created_at: product.created_at,
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
