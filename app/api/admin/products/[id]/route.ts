import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const result = await sql`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.short_description,
        p.sku,
        p.price::numeric as price,
        p.compare_price::numeric as compare_price,
        p.cost::numeric as cost,
        p.category_id,
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
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const product = result[0]

    // Parse JSON fields safely
    const processedProduct = {
      ...product,
      price: Number.parseFloat(product.price) || 0,
      compare_price: product.compare_price ? Number.parseFloat(product.compare_price) : null,
      cost: product.cost ? Number.parseFloat(product.cost) : null,
      room_type_id: product.room_type_id ? Number.parseInt(product.room_type_id) : null,
      images: Array.isArray(product.images)
        ? product.images
        : typeof product.images === "string"
          ? product.images.startsWith("[")
            ? JSON.parse(product.images)
            : [product.images]
          : [],
      tags: Array.isArray(product.tags)
        ? product.tags
        : typeof product.tags === "string"
          ? product.tags.startsWith("[")
            ? JSON.parse(product.tags)
            : product.tags.split(",").map((t) => t.trim())
          : [],
      variants: [], // Add empty variants array for now
    }

    return NextResponse.json({
      success: true,
      product: processedProduct,
    })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
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

    // Validate required fields
    if (!name || !sku || price === undefined) {
      return NextResponse.json({ error: "Name, SKU, and price are required" }, { status: 400 })
    }

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
        stock_quantity = ${stock_quantity || 0},
        track_quantity = ${track_quantity || false},
        continue_selling = ${continue_selling || false},
        material = ${material || ""},
        color = ${color || ""},
        brand = ${brand || ""},
        status = ${status || "active"},
        images = ${JSON.stringify(images || [])},
        tags = ${JSON.stringify(tags || [])},
        is_featured = ${is_featured || false},
        is_trending = ${is_trending || false},
        is_best_seller = ${is_best_seller || false},
        is_hot_selling = ${is_hot_selling || false},
        is_deal_of_day = ${is_deal_of_day || false},
        is_latest = ${is_latest || false},
        meta_title = ${meta_title || ""},
        meta_description = ${meta_description || ""},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: { id: result[0].id },
    })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const result = await sql`
      DELETE FROM products 
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
