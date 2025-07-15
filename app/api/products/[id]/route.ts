import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    console.log("Fetching product with ID:", id)

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
      WHERE p.id = '${id}' AND p.status = 'active'
    `

    const result = await sql`${sql.unsafe(productQuery)}`

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 },
      )
    }

    const product = result[0]

    const transformedProduct = {
      ...product,
      price: Number.parseFloat(product.price) || 0,
      compare_price: product.compare_price ? Number.parseFloat(product.compare_price) : null,
      average_rating: Number.parseFloat(product.average_rating) || 0,
      review_count: Number.parseInt(product.review_count) || 0,
      stock_quantity: Number.parseInt(product.stock_quantity) || 0,
      images: typeof product.images === "string" ? product.images : JSON.stringify(product.images || []),
      tags: typeof product.tags === "string" ? product.tags : JSON.stringify(product.tags || []),
      room_type: product.room_type_name,
    }

    console.log("Product found:", transformedProduct.name)

    return NextResponse.json({
      success: true,
      product: transformedProduct,
    })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch product",
      },
      { status: 500 },
    )
  }
}
