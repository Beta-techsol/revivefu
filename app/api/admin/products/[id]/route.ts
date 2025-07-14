import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    console.log("Fetching admin product with ID:", id)

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
        p.room_type,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = '${id}'
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

    // Transform product to ensure proper data types
    const transformedProduct = {
      ...product,
      price: Number.parseFloat(product.price) || 0,
      compare_price: product.compare_price ? Number.parseFloat(product.compare_price) : null,
      average_rating: Number.parseFloat(product.average_rating) || 0,
      review_count: Number.parseInt(product.review_count) || 0,
      stock_quantity: Number.parseInt(product.stock_quantity) || 0,
      images: typeof product.images === "string" ? product.images : JSON.stringify(product.images || []),
      tags: typeof product.tags === "string" ? product.tags : JSON.stringify(product.tags || []),
    }

    console.log("Admin product found:", transformedProduct.name)

    return NextResponse.json({
      success: true,
      data: transformedProduct,
    })
  } catch (error) {
    console.error("Error fetching admin product:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch product",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    console.log("Updating product with ID:", id, "Data:", body)

    const {
      name,
      description,
      short_description,
      price,
      compare_price,
      sku,
      status,
      stock_quantity,
      category_id,
      images,
      tags,
      material,
      color,
      brand,
      is_featured,
      is_trending,
      is_best_seller,
      is_hot_selling,
      is_deal_of_day,
      is_latest,
      room_type,
    } = body

    const updateQuery = `
      UPDATE products SET
        name = '${name}',
        description = '${description || ""}',
        short_description = '${short_description || ""}',
        price = ${price},
        compare_price = ${compare_price || "NULL"},
        sku = '${sku}',
        status = '${status}',
        stock_quantity = ${stock_quantity},
        category_id = '${category_id}',
        images = '${JSON.stringify(images || [])}',
        tags = '${JSON.stringify(tags || [])}',
        material = '${material || ""}',
        color = '${color || ""}',
        brand = '${brand || ""}',
        is_featured = ${is_featured || false},
        is_trending = ${is_trending || false},
        is_best_seller = ${is_best_seller || false},
        is_hot_selling = ${is_hot_selling || false},
        is_deal_of_day = ${is_deal_of_day || false},
        is_latest = ${is_latest || false},
        room_type = '${room_type || ""}',
        updated_at = NOW()
      WHERE id = '${id}'
      RETURNING *
    `

    const result = await sql`${sql.unsafe(updateQuery)}`

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found or update failed",
        },
        { status: 404 },
      )
    }

    console.log("Product updated successfully:", result[0].name)

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Product updated successfully",
    })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update product",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    console.log("Deleting product with ID:", id)

    const deleteQuery = `DELETE FROM products WHERE id = '${id}' RETURNING *`

    const result = await sql`${sql.unsafe(deleteQuery)}`

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 },
      )
    }

    console.log("Product deleted successfully:", result[0].name)

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete product",
      },
      { status: 500 },
    )
  }
}
