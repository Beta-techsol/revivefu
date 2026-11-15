import { sql } from "@/lib/db"
import { unstable_noStore as noStore } from "next/cache"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  noStore()
  try {
    const categories = await sql`
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
      WHERE c.is_active = true
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.name ASC
    `

    return NextResponse.json({
      success: true,
      categories,
    }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } })
  } catch (error: any) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
