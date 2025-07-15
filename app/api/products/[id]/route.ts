import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    console.log("Single Product API - Product ID:", id)

    // Get single product with proper JOINs
    const productQuery = `
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
        p.room_type_id,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.slug as category_slug,
        COALESCE(rt.name, 'General') as room_type,
        COALESCE(rt.slug, 'general') as room_type_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN room_types rt ON p.room_type_id = rt.id
      WHERE p.id = $1 AND p.status = 'active'
    `

    console.log("Single product query:", productQuery)
    const products = await sql(productQuery, [id])

    if (products.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 },
      )
    }

    const product = products[0]

    // Transform product to ensure proper data types
    const transformedProduct = {
      ...product,
      price: Number.parseFloat(product.price) || 0,
      compare_price: product.compare_price ? Number.parseFloat(product.compare_price) : null,
      average_rating: Number.parseFloat(product.average_rating) || 0,
      review_count: Number.parseInt(product.review_count) || 0,
      stock_quantity: Number.parseInt(product.stock_quantity) || 0,
      images: typeof product.images === "string" ? JSON.parse(product.images) : product.images || [],
      tags: typeof product.tags === "string" ? JSON.parse(product.tags) : product.tags || [],
    }

    console.log("Single Product API - Result:", {
      productId: transformedProduct.id,
      productName: transformedProduct.name,
      category: transformedProduct.category_name,
      roomType: transformedProduct.room_type,
    })

    return NextResponse.json({
      success: true,
      product: transformedProduct,
    })
  } catch (error) {
    console.error("Error in single product API:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch product",
      },
      { status: 500 },
    )
  }
}
