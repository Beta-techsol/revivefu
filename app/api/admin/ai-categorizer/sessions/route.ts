import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { aiCategorySafety } from "@/lib/ai-categorizer-safety"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const authResult = await aiCategorySafety.verifyAdminAccess(request)
    if (!authResult.user) {
      return NextResponse.json({ success: false, error: authResult.error || "Authentication failed" }, { status: 401 })
    }

    // Get all AI categorization sessions with user info
    const sessions = await sql`
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
        s.metadata,
        au.name as created_by_user,
        CASE 
          WHEN s.session_type = 'apply' AND s.status = 'completed' THEN true
          ELSE false
        END as can_rollback
      FROM ai_categorization_sessions s
      LEFT JOIN admin_users au ON s.created_by = au.id
      WHERE s.session_type IN ('apply', 'backup', 'rollback')
      ORDER BY s.started_at DESC
      LIMIT 50
    `

    const formattedSessions = sessions.map((session: any) => ({
      id: session.id,
      sessionType: session.session_type,
      status: session.status,
      totalProducts: session.total_products || 0,
      processedProducts: session.processed_products || 0,
      successfulCategorizations: session.successful_categorizations || 0,
      failedCategorizations: session.failed_categorizations || 0,
      newCategoriesCreated: session.new_categories_created || 0,
      averageConfidence: session.average_confidence || 0,
      startedAt: session.started_at,
      completedAt: session.completed_at,
      errorMessage: session.error_message,
      metadata: session.metadata,
      createdByUser: session.created_by_user || "Unknown",
      canRollback: session.can_rollback,
    }))

    return NextResponse.json({
      success: true,
      sessions: formattedSessions,
    })
  } catch (error) {
    console.error("Sessions API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch sessions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
