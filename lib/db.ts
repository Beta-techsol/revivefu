import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Test database connection
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time`
    console.log("Database connected successfully:", result[0].current_time)
    return { success: true, time: result[0].current_time }
  } catch (error) {
    console.error("Database connection failed:", error)
    throw error
  }
}

// Execute a single query and return first result
export async function executeQuerySingle(query: string, params: any[] = []) {
  try {
    const result = await sql(query, params)
    return result[0] || null
  } catch (error) {
    console.error("Query execution failed:", error)
    throw error
  }
}

// Execute query and return all results
export async function executeQuery(query: string, params: any[] = []) {
  try {
    return await sql(query, params)
  } catch (error) {
    console.error("Query execution failed:", error)
    throw error
  }
}
