import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { aiCategorySafety } from "@/lib/ai-categorizer-safety"

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Session ID is required" }, { status: 400 })
    }

    // Verify admin access
    const authResult = await aiCategorySafety.verifyAdminAccess(request)
    if (!authResult.user) {
      return NextResponse.json({ success: false, error: authResult.error || "Authentication failed" }, { status: 401 })
    }

    const adminUser = authResult.user

    // Validate the target session exists and can be rolled back
    const targetSession = await sql`
      SELECT id, session_type, status, total_products
      FROM ai_categorization_sessions 
      WHERE id = ${sessionId} 
      AND session_type = 'apply' 
      AND status = 'completed'
    `

    if (targetSession.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid session ID or session cannot be rolled back" },
        { status: 400 },
      )
    }

    // Check if session has already been rolled back
    const existingRollback = await sql`
      SELECT id FROM ai_categorization_sessions
      WHERE session_type = 'rollback'
      AND metadata->>'target_session_id' = ${sessionId}
      AND status = 'completed'
    `

    if (existingRollback.length > 0) {
      return NextResponse.json({ success: false, error: "This session has already been rolled back" }, { status: 400 })
    }

    // Start rollback process
    const rollbackSessionId = crypto.randomUUID()

    await sql.begin(async (sql) => {
      // Create rollback session record
      await sql`
        INSERT INTO ai_categorization_sessions (
          id, session_type, status, started_at, created_by, metadata
        ) VALUES (
          ${rollbackSessionId}, 'rollback', 'running', NOW(), ${adminUser.id},
          ${JSON.stringify({ target_session_id: sessionId })}
        )
      `

      // Get all product backups for this session
      const backups = await sql`
        SELECT product_id, original_category_id, original_category_name
        FROM product_category_backups
        WHERE session_id = ${sessionId}
      `

      let rollbackCount = 0
      let errorCount = 0

      // Restore each product to its original category
      for (const backup of backups) {
        try {
          await sql`
            UPDATE products 
            SET category_id = ${backup.original_category_id}, updated_at = NOW()
            WHERE id = ${backup.product_id}
          `

          // Log the rollback action
          await sql`
            INSERT INTO categorization_logs (
              session_id, product_id, action, old_category_id, new_category_id, 
              dry_run, metadata, created_by
            ) VALUES (
              ${rollbackSessionId}, ${backup.product_id}, 'rollback',
              (SELECT category_id FROM products WHERE id = ${backup.product_id}),
              ${backup.original_category_id}, false,
              ${JSON.stringify({ rollback_from_session: sessionId })}, ${adminUser.id}
            )
          `

          rollbackCount++
        } catch (error) {
          console.error(`Failed to rollback product ${backup.product_id}:`, error)
          errorCount++

          // Log the error
          await sql`
            INSERT INTO categorization_logs (
              session_id, product_id, action, error_message, dry_run, created_by
            ) VALUES (
              ${rollbackSessionId}, ${backup.product_id}, 'error',
              ${error instanceof Error ? error.message : "Unknown error"}, false, ${adminUser.id}
            )
          `
        }
      }

      // Mark original session as rolled back
      await sql`
        UPDATE ai_categorization_sessions 
        SET status = 'rolled_back', metadata = COALESCE(metadata, '{}') || '{"rolled_back_at": "${new Date().toISOString()}", "rolled_back_by": ${adminUser.id}}'
        WHERE id = ${sessionId}
      `

      // Complete rollback session
      await sql`
        UPDATE ai_categorization_sessions 
        SET 
          status = ${errorCount > 0 ? "completed_with_errors" : "completed"},
          completed_at = NOW(),
          total_products = ${backups.length},
          processed_products = ${rollbackCount},
          successful_categorizations = ${rollbackCount},
          failed_categorizations = ${errorCount},
          metadata = metadata || ${JSON.stringify({
            rollback_count: rollbackCount,
            error_count: errorCount,
            target_session_id: sessionId,
          })}
        WHERE id = ${rollbackSessionId}
      `
    })

    // Log security event
    await aiCategorySafety.logSecurityEvent(
      adminUser.id,
      "rollback_completed",
      {
        targetSessionId: sessionId,
        rollbackSessionId,
        productsRolledBack:
          await sql`SELECT COUNT(*) as count FROM product_category_backups WHERE session_id = ${sessionId}`.then(
            (r) => r[0]?.count || 0,
          ),
      },
      "info",
    )

    return NextResponse.json({
      success: true,
      message: "Rollback completed successfully",
      rollbackSessionId,
      details: {
        targetSessionId: sessionId,
        productsProcessed: targetSession[0].total_products,
      },
    })
  } catch (error) {
    console.error("Rollback API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Rollback failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
