import type { NextRequest } from "next/server"
import { sql } from "@/lib/db"

// GET /api/categories - Public categories API
export async function GET(request: NextRequest) {
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

    return Response.json({ categories })
  } catch (error) {
    console.error("Categories fetch error:", error)
    return Response.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
