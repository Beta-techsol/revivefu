import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Test database connection
    const result = await sql`SELECT NOW() as current_time, version() as db_version`

    // Test products table
    const productCount = await sql`SELECT COUNT(*) as count FROM products`

    // Test categories table
    const categoryCount = await sql`SELECT COUNT(*) as count FROM categories`

    return Response.json({
      status: "success",
      message: "Database connection successful",
      data: {
        current_time: result[0].current_time,
        db_version: result[0].db_version,
        product_count: productCount[0].count,
        category_count: categoryCount[0].count,
      },
    })
  } catch (error) {
    console.error("Database test error:", error)
    return Response.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
