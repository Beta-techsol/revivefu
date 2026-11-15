import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath, unstable_noStore as noStore } from "next/cache"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
}

function safeParseArray(value: unknown, splitComma = false): string[] {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed) return []
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed)
        return Array.isArray(parsed) ? parsed.map(String) : [trimmed]
      } catch {
        return [trimmed]
      }
    }
    return splitComma ? trimmed.split(",").map((t) => t.trim()).filter(Boolean) : [trimmed]
  }
  return []
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  noStore()
  try {
    const { id } = params

    const result = await sql`
      SELECT
        p.id,
        p.slug,
        p.name,
        p.description,
        p.short_description,
        p.sku,
        p.price::numeric as price,
        p.compare_price::numeric as compare_price,
        p.cost::numeric as cost,
        COALESCE(
          p.category_id,
          (
            SELECT pc.category_id
            FROM product_categories pc
            WHERE pc.product_id = p.id
            LIMIT 1
          )
        ) as category_id,
        p.room_type_id,
        p.stock_quantity,
        p.track_quantity,
        p.continue_selling,
        p.material,
        p.color,
        p.brand,
        p.status,
        p.images,
        p.tags,
        p.is_featured,
        p.is_trending,
        p.is_best_seller,
        p.is_hot_selling,
        p.is_deal_of_day,
        p.is_latest,
        p.meta_title,
        p.meta_description,
        p.average_rating::numeric as average_rating,
        p.review_count,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        rt.name as room_type_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN room_type rt ON p.room_type_id = rt.id
      WHERE p.id = ${id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404, headers: noStoreHeaders })
    }

    const product = result[0]
    const parsedStock = Number.parseInt(String(product.stock_quantity ?? 0), 10)

    const processedProduct = {
      ...product,
      price: Number.parseFloat(product.price) || 0,
      compare_price: product.compare_price ? Number.parseFloat(product.compare_price) : null,
      cost: product.cost ? Number.parseFloat(product.cost) : null,
      stock_quantity: Number.isFinite(parsedStock) ? Math.max(0, parsedStock) : 0,
      average_rating: Number.parseFloat(product.average_rating) || 0,
      review_count: Number.parseInt(String(product.review_count ?? 0), 10) || 0,
      room_type_id: product.room_type_id ? Number.parseInt(String(product.room_type_id), 10) : null,
      images: safeParseArray(product.images, false),
      tags: safeParseArray(product.tags, true),
      variants: [],
    }

    return NextResponse.json(
      {
        success: true,
        product: processedProduct,
      },
      { headers: noStoreHeaders },
    )
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500, headers: noStoreHeaders })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    const {
      name,
      description,
      short_description,
      sku,
      price,
      compare_price,
      cost,
      category_id,
      category_ids,
      room_type_id,
      stock_quantity,
      track_quantity,
      continue_selling,
      material,
      color,
      brand,
      status,
      images,
      tags,
      is_featured,
      is_trending,
      is_best_seller,
      is_hot_selling,
      is_deal_of_day,
      is_latest,
      meta_title,
      meta_description,
    } = body

    if (!name || !sku || price === undefined) {
      return NextResponse.json(
        { error: "Name, SKU, and price are required" },
        { status: 400, headers: noStoreHeaders },
      )
    }

    const parsedStock = Math.max(0, Number.parseInt(String(stock_quantity ?? 0), 10) || 0)

    const result = await sql`
      UPDATE products SET
        name = ${name},
        description = ${description || ""},
        short_description = ${short_description || ""},
        sku = ${sku},
        price = ${price},
        compare_price = ${compare_price || null},
        cost = ${cost || null},
        category_id = ${category_id || null},
        room_type_id = ${room_type_id || null},
        stock_quantity = ${parsedStock},
        track_quantity = ${Boolean(track_quantity)},
        continue_selling = ${Boolean(continue_selling)},
        material = ${material || ""},
        color = ${color || ""},
        brand = ${brand || ""},
        status = ${status || "active"},
        images = ${JSON.stringify(images || [])},
        tags = ${JSON.stringify(tags || [])},
        is_featured = ${Boolean(is_featured)},
        is_trending = ${Boolean(is_trending)},
        is_best_seller = ${Boolean(is_best_seller)},
        is_hot_selling = ${Boolean(is_hot_selling)},
        is_deal_of_day = ${Boolean(is_deal_of_day)},
        is_latest = ${Boolean(is_latest)},
        meta_title = ${meta_title || ""},
        meta_description = ${meta_description || ""},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, slug, stock_quantity
    `

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404, headers: noStoreHeaders })
    }

    const updated = result[0]

    // Sync product_categories if category_ids or category_id was provided
    const categoriesToSync: string[] = Array.isArray(category_ids)
      ? category_ids.filter(Boolean).map(String)
      : category_id
        ? [String(category_id)]
        : []

    if (categoriesToSync.length > 0) {
      try {
        await sql`DELETE FROM product_categories WHERE product_id = ${id}`
        for (const catId of categoriesToSync) {
          await sql`
            INSERT INTO product_categories (product_id, category_id)
            VALUES (${id}, ${catId})
            ON CONFLICT (product_id, category_id) DO NOTHING
          `
        }
      } catch (catErr) {
        console.warn("Non-fatal error syncing product_categories:", catErr)
      }
    }

    // Revalidate affected frontend routes immediately
    try {
      revalidatePath("/")
      revalidatePath("/shop")
      revalidatePath("/category")
      if (updated.slug) {
        revalidatePath(`/product/${updated.slug}`)
      }
    } catch (revalErr) {
      console.warn("Revalidation warning:", revalErr)
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        product: {
          id: updated.id,
          slug: updated.slug,
          stock_quantity: Number.parseInt(String(updated.stock_quantity ?? parsedStock), 10) || 0,
        },
      },
      { headers: noStoreHeaders },
    )
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500, headers: noStoreHeaders })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const result = await sql`
      DELETE FROM products
      WHERE id = ${id}
      RETURNING id, slug
    `

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404, headers: noStoreHeaders })
    }

    try {
      revalidatePath("/")
      revalidatePath("/shop")
      revalidatePath("/category")
      if (result[0].slug) {
        revalidatePath(`/product/${result[0].slug}`)
      }
    } catch (revalErr) {
      console.warn("Revalidation warning:", revalErr)
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
      },
      { headers: noStoreHeaders },
    )
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500, headers: noStoreHeaders })
  }
}
