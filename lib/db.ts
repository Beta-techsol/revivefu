import { neon } from "@neondatabase/serverless"

console.log("[v0] DATABASE_URL exists:", !!process.env.DATABASE_URL)
console.log("[v0] DATABASE_URL length:", process.env.DATABASE_URL?.length || 0)

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL, {
  // Add connection options for better debugging
})

// Test the connection
export async function testConnection() {
  try {
    console.log("[v0] Testing database connection...")
    const result = await sql`SELECT NOW() as current_time, version() as db_version`
    console.log("[v0] Database connected successfully:", result[0])
    return true
  } catch (error) {
    console.error("[v0] Database connection failed:", error)
    console.error("[v0] Connection error type:", typeof error)
    console.error("[v0] Connection error name:", error instanceof Error ? error.constructor.name : "Unknown")
    console.error("[v0] Connection error message:", error instanceof Error ? error.message : "Unknown error")

    if (error instanceof Error) {
      if (error.message.includes("Failed to fetch")) {
        console.error("[v0] This appears to be a network/fetch error - check DATABASE_URL format")
      }
      if (error.message.includes("ENOTFOUND")) {
        console.error("[v0] DNS resolution failed - check database host")
      }
    }

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
