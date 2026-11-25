import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const revalidate = 60

const cacheHeaders = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
}

function safeJsonArray(value: unknown): any[] {
  if (Array.isArray(value)) return value
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed) return []
    try {
      const parsed = JSON.parse(trimmed)
      return Array.isArray(parsed) ? parsed : trimmed ? [trimmed] : []
    } catch {
      return trimmed.includes(",")
        ? trimmed.split(",").map((s) => s.trim()).filter(Boolean)
        : [trimmed]
    }
  }
  return []
}

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    const result = await sql`
      SELECT
        p.id,
        p.slug,
        p.name,
        p.price::numeric as price,
        p.compare_price::numeric as compare_price,
        p.description,
        p.short_description,
        p.sku,
        p.status,
        p.stock_quantity,
        p.continue_selling,
        p.track_quantity,
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
        COALESCE(
          c.name,
          (
            SELECT cat.name
            FROM product_categories pc
            JOIN categories cat ON pc.category_id = cat.id
            WHERE pc.product_id = p.id
            LIMIT 1
          )
        ) as category_name,
        COALESCE(
          c.slug,
          (
            SELECT cat.slug
            FROM product_categories pc
            JOIN categories cat ON pc.category_id = cat.id
            WHERE pc.product_id = p.id
            LIMIT 1
          )
        ) as category_slug,
        COALESCE(
          c.id,
          (
            SELECT cat.id
            FROM product_categories pc
            JOIN categories cat ON pc.category_id = cat.id
            WHERE pc.product_id = p.id
            LIMIT 1
          )
        ) as category_id,
        COALESCE(
          (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT('id', cat.id, 'name', cat.name, 'slug', cat.slug)
            )
            FROM product_categories pc
            JOIN categories cat ON pc.category_id = cat.id
            WHERE pc.product_id = p.id
          ),
          '[]'::json
        ) as categories,
        rt.name as room_type_name,
        rt.slug as room_type_slug,
        rt.id as room_type_id
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN room_type rt ON p.room_type_id = rt.id
      WHERE p.slug = ${slug} AND p.status = 'active'
      LIMIT 1
    `

    if (!result || result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        {
          status: 404,
          headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
        },
      )
    }

    const product = result[0]
    const parsedStock = Number.parseInt(String(product.stock_quantity ?? 0), 10)
    const parsedCategories = Array.isArray(product.categories)
      ? product.categories
      : product.category_id
        ? [{ id: product.category_id, name: product.category_name, slug: product.category_slug }]
        : []

    const transformedProduct = {
      ...product,
      price: Number.parseFloat(product.price) || 0,
      compare_price: product.compare_price ? Number.parseFloat(product.compare_price) : null,
      average_rating: Number.parseFloat(product.average_rating) || 0,
      review_count: Number.parseInt(String(product.review_count ?? 0), 10) || 0,
      stock_quantity: Number.isFinite(parsedStock) ? Math.max(0, parsedStock) : 0,
      continue_selling: Boolean(product.continue_selling),
      track_quantity: product.track_quantity !== false,
      images: JSON.stringify(safeJsonArray(product.images)),
      tags: JSON.stringify(safeJsonArray(product.tags)),
      categories: parsedCategories,
      category_name: product.category_name || parsedCategories[0]?.name || null,
      category_slug: product.category_slug || parsedCategories[0]?.slug || null,
      category_id: product.category_id || parsedCategories[0]?.id || null,
      room_type: product.room_type_name || null,
    }

    return NextResponse.json(
      {
        success: true,
        product: transformedProduct,
      },
      {
        headers: cacheHeaders,
      },
    )
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch product",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
      },
    )
  }
}
