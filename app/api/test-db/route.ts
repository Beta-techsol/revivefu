import { sql, testConnection } from "@/lib/db"

export async function GET() {
  try {
    // Test basic connection
    const connectionTest = await testConnection()

    // Test table existence
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    // Count records in each table
    const tableCounts: any = {}
    for (const table of tables) {
      try {
        const count = await sql`SELECT COUNT(*) as count FROM ${sql(table.table_name)}`
        tableCounts[table.table_name] = count[0].count
      } catch (error) {
        tableCounts[table.table_name] = "Error"
      }
    }

    return Response.json({
      success: true,
      connection: connectionTest,
      tables: tables.map((t) => t.table_name),
      tableCounts,
      message: "Database connection successful",
    })
  } catch (error: any) {
    console.error("Database test error:", error)
    return Response.json(
      {
        success: false,
        error: error.message,
        message: "Database connection failed",
      },
      { status: 500 },
    )
  }
}
