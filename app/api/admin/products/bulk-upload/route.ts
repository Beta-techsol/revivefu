import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

interface ProductData {
  name: string
  description: string
  short_description?: string
  sku: string
  price: number
  compare_price?: number
  category: string
  stock_quantity: number
  images: string[]
  status: string
  is_featured: boolean
  is_trending: boolean
  is_best_seller: boolean
  is_hot_selling: boolean
  is_deal_of_day: boolean
  is_latest: boolean
  room_type?: string
  material?: string
  color?: string
  brand?: string
  weight?: number
  tags: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { products } = await request.json()

    if (!products || !Array.isArray(products)) {
      return NextResponse.json({ success: false, error: "Invalid products data" }, { status: 400 })
    }

    const results = []
    const categoriesCreated = new Set<string>()

    for (const productData of products) {
      try {
        // Validate required fields
        if (!productData.name || !productData.price || !productData.category) {
          results.push({
            ...productData,
            status: "error",
            error: "Missing required fields (name, price, category)",
          })
          continue
        }

        // Check if category exists, create if not
        const categorySlug = productData.category.toLowerCase().replace(/\s+/g, "-")

        const existingCategory = await sql`
          SELECT id FROM categories WHERE slug = ${categorySlug}
        `

        let categoryId
        if (existingCategory.length === 0) {
          // Create new category
          const newCategory = await sql`
            INSERT INTO categories (name, slug, description, is_active)
            VALUES (${productData.category}, ${categorySlug}, ${`Products in ${productData.category} category`}, true)
            RETURNING id
          `
          categoryId = newCategory[0].id
          categoriesCreated.add(productData.category)
        } else {
          categoryId = existingCategory[0].id
        }

        // Generate SKU if not provided
        const sku =
          productData.sku || `${categorySlug.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`

        // Check if SKU already exists
        const existingSku = await sql`
          SELECT id FROM products WHERE sku = ${sku}
        `

        if (existingSku.length > 0) {
          results.push({
            ...productData,
            status: "error",
            error: "SKU already exists",
          })
          continue
        }

        // Prepare product data
        const product: ProductData = {
          name: productData.name,
          description: productData.description || productData.short_description || "",
          short_description: productData.short_description || productData.description?.substring(0, 200) || "",
          sku,
          price: Number.parseFloat(productData.price.toString()),
          compare_price: productData.compare_price ? Number.parseFloat(productData.compare_price.toString()) : null,
          category: productData.category,
          stock_quantity: Number.parseInt(productData.stock_quantity?.toString() || "0"),
          images: productData.images || [productData.image_url || "/placeholder.jpg"],
          status: productData.status || "active",
          is_featured: productData.is_featured || false,
          is_trending: productData.is_trending || false,
          is_best_seller: productData.is_best_seller || false,
          is_hot_selling: productData.is_hot_selling || false,
          is_deal_of_day: productData.is_deal_of_day || false,
          is_latest: productData.is_latest || true,
          room_type: productData.room_type || null,
          material: productData.material || null,
          color: productData.color || null,
          brand: productData.brand || null,
          weight: productData.weight ? Number.parseFloat(productData.weight.toString()) : null,
          tags: productData.tags || [],
        }

        // Insert product into database
        const insertedProduct = await sql`
          INSERT INTO products (
            name, description, short_description, sku, price, compare_price,
            category_id, stock_quantity, images, status,
            is_featured, is_trending, is_best_seller, is_hot_selling, is_deal_of_day, is_latest,
            room_type, material, color, brand, weight, tags,
            slug, meta_title, meta_description
          ) VALUES (
            ${product.name},
            ${product.description},
            ${product.short_description},
            ${product.sku},
            ${product.price},
            ${product.compare_price},
            ${categoryId},
            ${product.stock_quantity},
            ${JSON.stringify(product.images)},
            ${product.status},
            ${product.is_featured},
            ${product.is_trending},
            ${product.is_best_seller},
            ${product.is_hot_selling},
            ${product.is_deal_of_day},
            ${product.is_latest},
            ${product.room_type},
            ${product.material},
            ${product.color},
            ${product.brand},
            ${product.weight},
            ${JSON.stringify(product.tags)},
            ${product.name
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "")},
            ${product.name},
            ${product.description}
          )
          RETURNING id
        `

        results.push({
          ...productData,
          status: "success",
          id: insertedProduct[0].id,
          assignedFlags: [
            product.is_featured && "Featured",
            product.is_trending && "Trending",
            product.is_best_seller && "Best Seller",
            product.is_hot_selling && "Hot Selling",
            product.is_deal_of_day && "Deal of Day",
            product.is_latest && "Latest",
          ].filter(Boolean),
        })
      } catch (error) {
        console.error("Error processing product:", error)
        results.push({
          ...productData,
          status: "error",
          error: error instanceof Error ? error.message : "Failed to create product",
        })
      }
    }

    const successful = results.filter((r) => r.status === "success").length
    const failed = results.filter((r) => r.status === "error").length

    return NextResponse.json({
      success: true,
      data: {
        totalProcessed: results.length,
        successful,
        failed,
        skipped: 0,
        categoriesCreated: Array.from(categoriesCreated),
        results,
      },
    })
  } catch (error) {
    console.error("Bulk upload error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Bulk upload failed",
      },
      { status: 500 },
    )
  }
}
