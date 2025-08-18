import { type NextRequest, NextResponse } from "next/server"
import { AIProductCategorizer } from "@/lib/ai-categorizer"
import { aiCategorySafety } from "@/lib/ai-categorizer-safety"

export async function POST(request: NextRequest) {
  try {
    const { dryRun = true } = await request.json()

    const safetyCheck = await aiCategorySafety.performSafetyCheck(request, dryRun ? "dry_run" : "apply")

    if (!safetyCheck.isAllowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Safety check failed",
          errors: safetyCheck.errors,
          warnings: safetyCheck.warnings,
        },
        { status: 403 },
      )
    }

    const { user, warnings, backupSessionId } = safetyCheck

    const categorizer = new AIProductCategorizer(crypto.randomUUID(), user)

    let results
    try {
      results = await categorizer.runCategorizationPipeline(dryRun)
    } catch (error) {
      // Log the error
      if (user) {
        await aiCategorySafety.logSecurityEvent(
          user.id,
          "categorization_pipeline_error",
          { error: error instanceof Error ? error.message : "Unknown error", dryRun },
          "error",
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: "Categorization pipeline failed",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    const logs = categorizer
      .getLogs()
      .map(
        (log) =>
          `[${log.timestamp.toISOString()}] ${log.action.toUpperCase()}: Product ${log.productId} - ${JSON.stringify(log.details)}`,
      )

    const response = {
      success: true,
      results,
      logs,
      dryRun,
      warnings,
      backupSessionId,
      safetyInfo: {
        adminUser: user?.name,
        timestamp: new Date().toISOString(),
        productsProcessed: results.length,
      },
    }

    if (user) {
      await aiCategorySafety.logSecurityEvent(
        user.id,
        "categorization_completed",
        {
          dryRun,
          productsProcessed: results.length,
          backupSessionId,
        },
        "info",
      )
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("AI Categorization API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
