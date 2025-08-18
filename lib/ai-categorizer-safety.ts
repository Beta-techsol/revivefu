import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/lib/auth"
import type { NextRequest } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export interface SafetyConfig {
  maxProductsPerSession: number
  maxSessionsPerHour: number
  maxSessionsPerDay: number
  requireConfirmation: boolean
  autoBackup: boolean
  minConfidenceThreshold: number
}

export interface SafetyCheck {
  isAllowed: boolean
  reason?: string
  remainingQuota?: number
}

export interface AdminUser {
  id: number
  email: string
  name: string
  role: string
}

const DEFAULT_SAFETY_CONFIG: SafetyConfig = {
  maxProductsPerSession: 1000,
  maxSessionsPerHour: 5,
  maxSessionsPerDay: 20,
  requireConfirmation: true,
  autoBackup: true,
  minConfidenceThreshold: 30,
}

export class AICategorySafetyManager {
  private config: SafetyConfig

  constructor(config: Partial<SafetyConfig> = {}) {
    this.config = { ...DEFAULT_SAFETY_CONFIG, ...config }
  }

  // Verify admin authentication and permissions
  async verifyAdminAccess(request: NextRequest): Promise<{ user: AdminUser | null; error?: string }> {
    try {
      // Check for auth token in cookies (from admin layout)
      const authCookie = request.cookies.get("auth-token")?.value

      if (!authCookie) {
        return { user: null, error: "No authentication token found" }
      }

      // For admin routes, we need to check admin_users table
      const token = authCookie
      const decoded = verifyToken(token)

      if (!decoded) {
        return { user: null, error: "Invalid authentication token" }
      }

      // Verify admin user exists and is active
      const result = await sql`
        SELECT id, email, name, role, is_active
        FROM admin_users 
        WHERE email = ${decoded.email} AND is_active = true
      `

      if (result.length === 0) {
        return { user: null, error: "Admin user not found or inactive" }
      }

      const adminUser = result[0] as AdminUser

      // Check if user has permission for AI categorization (admin or super_admin)
      if (!["admin", "super_admin"].includes(adminUser.role)) {
        return { user: null, error: "Insufficient permissions for AI categorization" }
      }

      return { user: adminUser }
    } catch (error) {
      console.error("Admin verification error:", error)
      return { user: null, error: "Authentication verification failed" }
    }
  }

  // Check rate limits and quotas
  async checkRateLimits(adminUserId: number, sessionType: "dry_run" | "apply"): Promise<SafetyCheck> {
    try {
      const now = new Date()
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

      // Check hourly limit
      const hourlyCount = await sql`
        SELECT COUNT(*) as count
        FROM ai_categorization_sessions
        WHERE created_by = ${adminUserId}
        AND session_type = ${sessionType}
        AND started_at >= ${oneHourAgo.toISOString()}
      `

      const hourlyUsage = Number(hourlyCount[0]?.count || 0)
      if (hourlyUsage >= this.config.maxSessionsPerHour) {
        return {
          isAllowed: false,
          reason: `Hourly limit exceeded. Maximum ${this.config.maxSessionsPerHour} ${sessionType} sessions per hour.`,
          remainingQuota: 0,
        }
      }

      // Check daily limit
      const dailyCount = await sql`
        SELECT COUNT(*) as count
        FROM ai_categorization_sessions
        WHERE created_by = ${adminUserId}
        AND session_type = ${sessionType}
        AND started_at >= ${oneDayAgo.toISOString()}
      `

      const dailyUsage = Number(dailyCount[0]?.count || 0)
      if (dailyUsage >= this.config.maxSessionsPerDay) {
        return {
          isAllowed: false,
          reason: `Daily limit exceeded. Maximum ${this.config.maxSessionsPerDay} ${sessionType} sessions per day.`,
          remainingQuota: 0,
        }
      }

      return {
        isAllowed: true,
        remainingQuota: Math.min(
          this.config.maxSessionsPerHour - hourlyUsage,
          this.config.maxSessionsPerDay - dailyUsage,
        ),
      }
    } catch (error) {
      console.error("Rate limit check error:", error)
      return {
        isAllowed: false,
        reason: "Failed to check rate limits",
      }
    }
  }

  // Validate product count for session
  async validateProductCount(): Promise<SafetyCheck> {
    try {
      const productCount = await sql`
        SELECT COUNT(*) as count FROM products WHERE status = 'active'
      `

      const count = Number(productCount[0]?.count || 0)

      if (count > this.config.maxProductsPerSession) {
        return {
          isAllowed: false,
          reason: `Too many products to process. Maximum ${this.config.maxProductsPerSession} products per session. Found ${count} products.`,
        }
      }

      if (count === 0) {
        return {
          isAllowed: false,
          reason: "No active products found to categorize",
        }
      }

      return { isAllowed: true }
    } catch (error) {
      console.error("Product count validation error:", error)
      return {
        isAllowed: false,
        reason: "Failed to validate product count",
      }
    }
  }

  // Check for ongoing sessions
  async checkOngoingSessions(): Promise<SafetyCheck> {
    try {
      const ongoingSessions = await sql`
        SELECT id, session_type, started_at
        FROM ai_categorization_sessions
        WHERE status = 'running'
        AND started_at >= NOW() - INTERVAL '2 hours'
      `

      if (ongoingSessions.length > 0) {
        const session = ongoingSessions[0]
        return {
          isAllowed: false,
          reason: `Another AI categorization session is currently running (${session.session_type}). Please wait for it to complete.`,
        }
      }

      return { isAllowed: true }
    } catch (error) {
      console.error("Ongoing session check error:", error)
      return {
        isAllowed: false,
        reason: "Failed to check for ongoing sessions",
      }
    }
  }

  // Create automatic backup before applying changes
  async createAutoBackup(adminUserId: number): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    if (!this.config.autoBackup) {
      return { success: true }
    }

    try {
      const backupSessionId = crypto.randomUUID()

      // Create backup session
      await sql`
        INSERT INTO ai_categorization_sessions (
          id, session_type, status, started_at, created_by, metadata
        ) VALUES (
          ${backupSessionId}, 'backup', 'running', NOW(), ${adminUserId},
          ${'{"auto_backup": true, "created_before_apply": true}'}
        )
      `

      // Backup all current product categories
      const products = await sql`
        SELECT p.id, p.category_id, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active'
      `

      for (const product of products) {
        await sql`
          INSERT INTO product_category_backups (
            session_id, product_id, original_category_id, original_category_name, created_by
          ) VALUES (
            ${backupSessionId}, ${product.id}, ${product.category_id}, ${product.category_name}, ${adminUserId}
          )
        `
      }

      // Complete backup session
      await sql`
        UPDATE ai_categorization_sessions
        SET status = 'completed', completed_at = NOW(), total_products = ${products.length}
        WHERE id = ${backupSessionId}
      `

      return { success: true, sessionId: backupSessionId }
    } catch (error) {
      console.error("Auto backup error:", error)
      return { success: false, error: "Failed to create automatic backup" }
    }
  }

  // Validate AI response for safety
  validateAIResponse(response: any): { isValid: boolean; reason?: string } {
    if (!response) {
      return { isValid: false, reason: "Empty AI response" }
    }

    // Check required fields
    const requiredFields = ["suggestedCategory", "confidence", "reasoning"]
    for (const field of requiredFields) {
      if (!(field in response)) {
        return { isValid: false, reason: `Missing required field: ${field}` }
      }
    }

    // Validate confidence score
    const confidence = Number(response.confidence)
    if (isNaN(confidence) || confidence < 0 || confidence > 100) {
      return { isValid: false, reason: "Invalid confidence score" }
    }

    if (confidence < this.config.minConfidenceThreshold) {
      return {
        isValid: false,
        reason: `Confidence score too low: ${confidence}% (minimum: ${this.config.minConfidenceThreshold}%)`,
      }
    }

    // Validate category name
    if (typeof response.suggestedCategory !== "string" || response.suggestedCategory.trim().length === 0) {
      return { isValid: false, reason: "Invalid category name" }
    }

    // Check for suspicious content
    const suspiciousPatterns = [
      /script/i,
      /javascript/i,
      /eval/i,
      /function/i,
      /<[^>]*>/, // HTML tags
      /[{}]/, // Curly braces (potential code injection)
    ]

    const textToCheck = `${response.suggestedCategory} ${response.reasoning} ${response.newCategoryDescription || ""}`
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(textToCheck)) {
        return { isValid: false, reason: "Potentially unsafe content detected in AI response" }
      }
    }

    return { isValid: true }
  }

  // Log security events
  async logSecurityEvent(
    adminUserId: number,
    event: string,
    details: any,
    severity: "info" | "warning" | "error" = "info",
  ): Promise<void> {
    try {
      await sql`
        INSERT INTO categorization_logs (
          session_id, product_id, action, metadata, created_by, dry_run
        ) VALUES (
          ${crypto.randomUUID()}, 0, 'security_event',
          ${JSON.stringify({ event, details, severity, timestamp: new Date().toISOString() })},
          ${adminUserId}, true
        )
      `
    } catch (error) {
      console.error("Failed to log security event:", error)
    }
  }

  // Comprehensive safety check
  async performSafetyCheck(
    request: NextRequest,
    sessionType: "dry_run" | "apply",
  ): Promise<{
    isAllowed: boolean
    user?: AdminUser
    errors: string[]
    warnings: string[]
    backupSessionId?: string
  }> {
    const errors: string[] = []
    const warnings: string[] = []
    let user: AdminUser | undefined
    let backupSessionId: string | undefined

    try {
      // 1. Verify admin access
      const authResult = await this.verifyAdminAccess(request)
      if (!authResult.user) {
        errors.push(authResult.error || "Authentication failed")
        return { isAllowed: false, errors, warnings }
      }
      user = authResult.user

      // 2. Check rate limits
      const rateLimitCheck = await this.checkRateLimits(user.id, sessionType)
      if (!rateLimitCheck.isAllowed) {
        errors.push(rateLimitCheck.reason || "Rate limit exceeded")
      }

      // 3. Validate product count
      const productCountCheck = await this.validateProductCount()
      if (!productCountCheck.isAllowed) {
        errors.push(productCountCheck.reason || "Product validation failed")
      }

      // 4. Check for ongoing sessions
      const ongoingCheck = await this.checkOngoingSessions()
      if (!ongoingCheck.isAllowed) {
        errors.push(ongoingCheck.reason || "Another session is running")
      }

      // 5. Create automatic backup for apply sessions
      if (sessionType === "apply" && errors.length === 0) {
        const backupResult = await this.createAutoBackup(user.id)
        if (!backupResult.success) {
          errors.push(backupResult.error || "Failed to create backup")
        } else {
          backupSessionId = backupResult.sessionId
          if (backupSessionId) {
            warnings.push("Automatic backup created before applying changes")
          }
        }
      }

      // Log security check
      await this.logSecurityEvent(
        user.id,
        "safety_check",
        {
          sessionType,
          errors,
          warnings,
          rateLimitQuota: rateLimitCheck.remainingQuota,
        },
        errors.length > 0 ? "error" : "info",
      )

      return {
        isAllowed: errors.length === 0,
        user,
        errors,
        warnings,
        backupSessionId,
      }
    } catch (error) {
      console.error("Safety check error:", error)
      errors.push("Safety check failed due to system error")

      if (user) {
        await this.logSecurityEvent(
          user.id,
          "safety_check_error",
          {
            error: error instanceof Error ? error.message : "Unknown error",
          },
          "error",
        )
      }

      return { isAllowed: false, errors, warnings }
    }
  }
}

export const aiCategorySafety = new AICategorySafetyManager()
