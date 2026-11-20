import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath, unstable_noStore as noStore } from "next/cache"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
}

async function ensureColumnsExist() {
  try {
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS continue_selling BOOLEAN DEFAULT false`
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS track_quantity BOOLEAN DEFAULT true`
  } catch (err) {
    // Non-fatal if table doesn't support ALTER or in mock mode
    console.warn("Notice: ensureColumnsExist skipped or non-fatal:", err)
  }
}

/**
 * GET: Scans all products across the database and checks their
 * 'Continue selling when out of stock' status.
 */
export async function GET() {
  noStore()
  try {
    await ensureColumnsExist()

    // Fetch all products across all pagination pages
    const products = await sql`
      SELECT 
        p.id, 
        p.name, 
        p.sku, 
        p.stock_quantity, 
        p.status,
        p.continue_selling,
        p.track_quantity
      FROM products p
      ORDER BY p.id ASC
    `

    const allProducts = Array.isArray(products) ? products : []
    const total = allProducts.length

    const enabledList: Array<{ id: string; name: string; sku: string; stock_quantity: number }> = []
    const disabledList: Array<{ id: string; name: string; sku: string; stock_quantity: number }> = []

    for (const prod of allProducts) {
      const isEnabled = Boolean(prod.continue_selling)
      const item = {
        id: String(prod.id),
        name: prod.name || "Unnamed Product",
        sku: prod.sku || "N/A",
        stock_quantity: Number(prod.stock_quantity) || 0,
      }
      if (isEnabled) {
        enabledList.push(item)
      } else {
        disabledList.push(item)
      }
    }

    const enabledCount = enabledList.length
    const disabledCount = disabledList.length
    const allEnabled = total > 0 && disabledCount === 0

    return NextResponse.json(
      {
        success: true,
        total,
        enabledCount,
        disabledCount,
        allEnabled,
        disabledProductIds: disabledList.map((p) => p.id),
        disabledSample: disabledList.slice(0, 10),
      },
      { headers: noStoreHeaders }
    )
  } catch (error) {
    console.error("Error scanning products for continue_selling:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to scan products",
      },
      { status: 500, headers: noStoreHeaders }
    )
  }
}

/**
 * POST: Bulk-enables 'Continue selling when out of stock' for specified or all remaining products.
 * Handles single batches or entire catalog update with verification.
 */
export async function POST(request: NextRequest) {
  noStore()
  try {
    await ensureColumnsExist()

    let body: { productIds?: Array<string | number>; mode?: "batch" | "all" } = {}
    try {
      body = await request.json()
    } catch {
      body = { mode: "all" }
    }

    const { productIds, mode } = body

    let updatedCount = 0
    let verifiedCount = 0

    if (Array.isArray(productIds) && productIds.length > 0) {
      // Batch mode for a specific array of product IDs
      const rawIds = productIds.map((id) => (typeof id === "number" ? id : Number(id) || id))

      await sql`
        UPDATE products 
        SET continue_selling = true, updated_at = NOW() 
        WHERE id = ANY(${rawIds})
      `

      // Verify that this batch was successfully enabled
      const verificationResult = await sql`
        SELECT id, continue_selling 
        FROM products 
        WHERE id = ANY(${rawIds})
      `

      const verified = (verificationResult || []).filter((p: any) => Boolean(p.continue_selling))
      verifiedCount = verified.length
      updatedCount = verifiedCount
    } else {
      // Bulk update mode for all products where continue_selling is not true
      await sql`
        UPDATE products 
        SET continue_selling = true, updated_at = NOW() 
        WHERE continue_selling IS NOT TRUE OR continue_selling = false
      `

      const check = await sql`
        SELECT COUNT(*) as enabled_count 
        FROM products 
        WHERE continue_selling = true
      `
      verifiedCount = Number(check[0]?.enabled_count || 0)
      updatedCount = verifiedCount
    }

    // Re-scan remaining disabled products across entire catalog
    const allProductsCheck = await sql`
      SELECT id, continue_selling 
      FROM products
    `
    const remainingDisabled = (allProductsCheck || []).filter((p: any) => !p.continue_selling)
    const remainingDisabledCount = remainingDisabled.length
    const allEnabled = remainingDisabledCount === 0

    // Invalidate caches so admin and storefront immediately reflect the update
    try {
      revalidatePath("/admin/products")
      revalidatePath("/shop")
      revalidatePath("/product/[slug]", "page")
    } catch (revalidateErr) {
      console.warn("Notice: revalidatePath warning:", revalidateErr)
    }

    return NextResponse.json(
      {
        success: true,
        updatedCount,
        verifiedCount,
        remainingDisabledCount,
        allEnabled,
        message: allEnabled
          ? "All products now have Continue selling when out of stock enabled."
          : `Successfully updated and verified ${updatedCount} products.`,
      },
      { headers: noStoreHeaders }
    )
  } catch (error) {
    console.error("Error updating continue_selling for products:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update continue_selling",
      },
      { status: 500, headers: noStoreHeaders }
    )
  }
}
