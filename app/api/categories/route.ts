import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export const revalidate = 300

const cacheHeaders = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
}

export async function GET() {
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
    }, { headers: cacheHeaders })
  } catch (error: any) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
