import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { aiCategorySafety } from "@/lib/ai-categorizer-safety"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "json"
    const sessionId = searchParams.get("sessionId")
    const type = searchParams.get("type") || "results" // results, logs, sessions

    // Verify admin access
    const authResult = await aiCategorySafety.verifyAdminAccess(request)
    if (!authResult.user) {
      return NextResponse.json({ success: false, error: authResult.error || "Authentication failed" }, { status: 401 })
    }

    let data: any[] = []
    let filename = `ai-categorization-export-${Date.now()}`

    switch (type) {
      case "sessions":
        data = await sql`
          SELECT 
            s.id,
            s.session_type,
            s.status,
            s.total_products,
            s.processed_products,
            s.successful_categorizations,
            s.failed_categorizations,
            s.new_categories_created,
            s.average_confidence,
            s.started_at,
            s.completed_at,
            s.error_message,
            au.name as created_by_user
          FROM ai_categorization_sessions s
          LEFT JOIN admin_users au ON s.created_by = au.id
          ORDER BY s.started_at DESC
          LIMIT 100
        `
        filename = `ai-categorization-sessions-${Date.now()}`
        break

      case "logs":
        const logsQuery = sessionId
          ? sql`
              SELECT 
                cl.id,
                cl.session_id,
                cl.product_id,
                cl.action,
                cl.old_category_id,
                cl.new_category_id,
                cl.suggested_category,
                cl.confidence,
                cl.reasoning,
                cl.needs_new_category,
                cl.dry_run,
                cl.error_message,
                cl.created_at,
                p.name as product_name,
                c_old.name as old_category_name,
                c_new.name as new_category_name
              FROM categorization_logs cl
              LEFT JOIN products p ON cl.product_id = p.id
              LEFT JOIN categories c_old ON cl.old_category_id = c_old.id
              LEFT JOIN categories c_new ON cl.new_category_id = c_new.id
              WHERE cl.session_id = ${sessionId}
              ORDER BY cl.created_at DESC
            `
          : sql`
              SELECT 
                cl.id,
                cl.session_id,
                cl.product_id,
                cl.action,
                cl.old_category_id,
                cl.new_category_id,
                cl.suggested_category,
                cl.confidence,
                cl.reasoning,
                cl.needs_new_category,
                cl.dry_run,
                cl.error_message,
                cl.created_at,
                p.name as product_name,
                c_old.name as old_category_name,
                c_new.name as new_category_name
              FROM categorization_logs cl
              LEFT JOIN products p ON cl.product_id = p.id
              LEFT JOIN categories c_old ON cl.old_category_id = c_old.id
              LEFT JOIN categories c_new ON cl.new_category_id = c_new.id
              WHERE cl.created_at >= NOW() - INTERVAL '30 days'
              ORDER BY cl.created_at DESC
              LIMIT 1000
            `

        data = await logsQuery
        filename = `ai-categorization-logs-${sessionId || "recent"}-${Date.now()}`
        break

      case "backups":
        const backupsQuery = sessionId
          ? sql`
              SELECT 
                pcb.id,
                pcb.session_id,
                pcb.product_id,
                pcb.original_category_id,
                pcb.original_category_name,
                pcb.backup_timestamp,
                p.name as product_name,
                c.name as current_category_name
              FROM product_category_backups pcb
              LEFT JOIN products p ON pcb.product_id = p.id
              LEFT JOIN categories c ON p.category_id = c.id
              WHERE pcb.session_id = ${sessionId}
              ORDER BY pcb.backup_timestamp DESC
            `
          : sql`
              SELECT 
                pcb.id,
                pcb.session_id,
                pcb.product_id,
                pcb.original_category_id,
                pcb.original_category_name,
                pcb.backup_timestamp,
                p.name as product_name,
                c.name as current_category_name
              FROM product_category_backups pcb
              LEFT JOIN products p ON pcb.product_id = p.id
              LEFT JOIN categories c ON p.category_id = c.id
              WHERE pcb.backup_timestamp >= NOW() - INTERVAL '90 days'
              ORDER BY pcb.backup_timestamp DESC
              LIMIT 5000
            `

        data = await backupsQuery
        filename = `ai-categorization-backups-${sessionId || "recent"}-${Date.now()}`
        break

      default:
        return NextResponse.json({ success: false, error: "Invalid export type" }, { status: 400 })
    }

    if (format === "csv") {
      // Convert to CSV
      if (data.length === 0) {
        return NextResponse.json({ success: false, error: "No data to export" }, { status: 400 })
      }

      const headers = Object.keys(data[0])
      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          headers
            .map((header) => {
              const value = row[header]
              if (value === null || value === undefined) return ""
              if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
                return `"${value.replace(/"/g, '""')}"`
              }
              return String(value)
            })
            .join(","),
        ),
      ].join("\n")

      return new Response(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${filename}.csv"`,
        },
      })
    } else {
      // Return JSON
      return new Response(JSON.stringify(data, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${filename}.json"`,
        },
      })
    }
  } catch (error) {
    console.error("Export API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Export failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
