import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    console.log("Fetching product with ID:", id)

    const products = await sql`
      SELECT 
        p.id,
        p.name,
        p.price::numeric as price,
        p.compare_price::numeric as compare_price,
        p.cost_price::numeric as cost_price,
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
        p.category_id,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.slug as category_slug,
        rt.name as room_type_name,
        rt.slug as room_type_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN room_type rt ON p.room_type_id = rt.id
      WHERE p.id = ${id}
    `

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
      cost_price: product.cost_price ? Number.parseFloat(product.cost_price) : null,
      average_rating: Number.parseFloat(product.average_rating) || 0,
      review_count: Number.parseInt(product.review_count) || 0,
      stock_quantity: Number.parseInt(product.stock_quantity) || 0,
      images: typeof product.images === "string" ? JSON.parse(product.images) : product.images || [],
      tags: typeof product.tags === "string" ? JSON.parse(product.tags) : product.tags || [],
    }

    console.log("Product fetched successfully:", transformedProduct.name)

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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    console.log("Updating product with ID:", id)
    console.log("Update data:", body)

    const {
      name,
      price,
      compare_price,
      cost_price,
      description,
      short_description,
      sku,
      status,
      stock_quantity,
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
      room_type_id,
      category_id,
    } = body

    // Update the product
    const updatedProducts = await sql`
      UPDATE products SET
        name = ${name},
        price = ${price},
        compare_price = ${compare_price || null},
        cost_price = ${cost_price || null},
        description = ${description},
        short_description = ${short_description},
        sku = ${sku},
        status = ${status},
        stock_quantity = ${stock_quantity},
        images = ${JSON.stringify(images)},
        tags = ${JSON.stringify(tags)},
        material = ${material},
        color = ${color},
        brand = ${brand},
        is_featured = ${is_featured || false},
        is_trending = ${is_trending || false},
        is_best_seller = ${is_best_seller || false},
        is_hot_selling = ${is_hot_selling || false},
        is_deal_of_day = ${is_deal_of_day || false},
        is_latest = ${is_latest || false},
        room_type_id = ${room_type_id || null},
        category_id = ${category_id || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (updatedProducts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 },
      )
    }

    console.log("Product updated successfully:", updatedProducts[0].name)

    return NextResponse.json({
      success: true,
      product: updatedProducts[0],
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

    const deletedProducts = await sql`
      DELETE FROM products
      WHERE id = ${id}
      RETURNING *
    `

    if (deletedProducts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 },
      )
    }

    console.log("Product deleted successfully:", deletedProducts[0].name)

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
