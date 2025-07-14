import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Helper function for single row queries
export async function executeQuerySingle<T = any>(query: string, params: any[] = []): Promise<T | null> {
  try {
    const result = await sql(query, params)
    return result[0] || null
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Helper function for multiple row queries
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    return await sql(query, params)
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Test database connection
export async function testConnection() {
  try {
    const result = await sql`SELECT 1 as test`
    console.log("Database connection successful:", result)
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}
