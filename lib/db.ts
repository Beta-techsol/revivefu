import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Helper function for parameterized queries
export async function query(text: string, params: any[] = []) {
  try {
    console.log("Executing query:", text)
    console.log("With params:", params)

    const result = await sql(text, params)
    console.log("Query result:", result)

    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}
