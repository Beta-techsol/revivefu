import { sql } from "@/lib/db"

// GET /api/categories - Public categories API
export async function GET() {
  try {
    const categories = await sql`
      SELECT * FROM categories 
      WHERE is_active = true 
      ORDER BY sort_order ASC, name ASC
    `

    return Response.json({
      categories,
      success: true,
    })
  } catch (error) {
    console.error("Categories fetch error:", error)
    return Response.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
