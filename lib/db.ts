import { neon } from "@neondatabase/serverless"

console.log("[v0] DATABASE_URL exists:", !!process.env.DATABASE_URL)
console.log("[v0] DATABASE_URL length:", process.env.DATABASE_URL?.length || 0)

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Test the connection
export async function testConnection() {
  try {
    console.log("[v0] Testing database connection...")
    const result = await sql`SELECT NOW() as current_time`
    console.log("[v0] Database connected successfully:", result[0].current_time)
    return true
  } catch (error) {
    console.error("[v0] Database connection failed:", error)
    console.error("[v0] Connection error type:", typeof error)
    console.error("[v0] Connection error message:", error instanceof Error ? error.message : "Unknown error")
    return false
  }
}

// Helper function to handle database errors
export function handleDbError(error: any) {
  console.error("Database error:", error)

  if (error.code === "23505") {
    return "Duplicate entry found"
  } else if (error.code === "23503") {
    return "Referenced record not found"
  } else if (error.code === "42P01") {
    return "Table does not exist"
  } else {
    return "Database operation failed"
  }
}
