import OpenAI from "openai"
import { neon } from "@neondatabase/serverless"
import { aiCategorySafety, type AdminUser } from "./ai-categorizer-safety"
import crypto from "crypto"

const sql = neon(process.env.DATABASE_URL!)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export interface Product {
  id: number
  name: string
  description: string | null
  images: string[] | null
  category_id: number | null
  current_category?: string
}

export interface Category {
  id: number
  name: string
  description: string | null
  slug: string
}

export interface CategorizationResult {
  productId: number
  productName: string
  currentCategory: string | null
  suggestedCategory: string
  confidence: number
  reasoning: string
  needsNewCategory: boolean
  newCategoryDescription?: string
}

export interface CategorizationLog {
  id: string
  timestamp: Date
  productId: number
  action: "analyzed" | "categorized" | "created_category" | "error"
  details: any
  dryRun: boolean
}

class AIProductCategorizer {
  private logs: CategorizationLog[] = []
  private sessionId: string
  private adminUser?: AdminUser

  constructor(sessionId?: string, adminUser?: AdminUser) {
    this.sessionId = sessionId || crypto.randomUUID()
    this.adminUser = adminUser
  }

  async getProducts(): Promise<Product[]> {
    const result = await sql`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.images,
        p.category_id,
        c.name as current_category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'active'
      ORDER BY p.id
    `
    return result as Product[]
  }

  async getCategories(): Promise<Category[]> {
    const result = await sql`
      SELECT id, name, description, slug
      FROM categories
      WHERE is_active = true
      ORDER BY name
    `
    return result as Category[]
  }

  async analyzeProduct(product: Product, categories: Category[]): Promise<CategorizationResult> {
    try {
      if (!product.name || product.name.trim().length === 0) {
        throw new Error("Product name is required")
      }

      if (categories.length === 0) {
        throw new Error("No categories available for analysis")
      }

      const categoryList = categories.map((c) => `- ${c.name}: ${c.description || "No description"}`).join("\n")

      const prompt = `You are an expert e-commerce product categorizer. Analyze this furniture product and suggest the best category.

Product Details:
- Name: ${product.name}
- Description: ${product.description || "No description"}
- Current Category: ${product.current_category || "Uncategorized"}

Available Categories:
${categoryList}

Instructions:
1. Analyze the product name and description
2. Choose the BEST MATCHING category from the list above
3. If NO category fits well, suggest a new category name
4. Provide confidence score (0-100)
5. Explain your reasoning

Respond in JSON format:
{
  "suggestedCategory": "exact category name from list OR new category name",
  "confidence": 85,
  "reasoning": "brief explanation of why this category fits",
  "needsNewCategory": false,
  "newCategoryDescription": "only if needsNewCategory is true"
}`

      const response = (await Promise.race([
        openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "You are an expert product categorization assistant. Always respond with valid JSON. Never include harmful or inappropriate content.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 500,
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("OpenAI request timeout")), 30000)),
      ])) as any

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error("No response from OpenAI")
      }

      let aiResult
      try {
        aiResult = JSON.parse(content)
      } catch (parseError) {
        throw new Error(`Failed to parse AI response: ${content}`)
      }

      const validation = aiCategorySafety.validateAIResponse(aiResult)
      if (!validation.isValid) {
        throw new Error(`Invalid AI response: ${validation.reason}`)
      }

      const result: CategorizationResult = {
        productId: product.id,
        productName: product.name,
        currentCategory: product.current_category || null,
        suggestedCategory: aiResult.suggestedCategory,
        confidence: aiResult.confidence || 0,
        reasoning: aiResult.reasoning || "No reasoning provided",
        needsNewCategory: aiResult.needsNewCategory || false,
        newCategoryDescription: aiResult.newCategoryDescription,
      }

      this.addLog({
        id: `analyze_${product.id}_${Date.now()}`,
        timestamp: new Date(),
        productId: product.id,
        action: "analyzed",
        details: result,
        dryRun: true,
      })

      return result
    } catch (error) {
      const errorResult: CategorizationResult = {
        productId: product.id,
        productName: product.name,
        currentCategory: product.current_category || null,
        suggestedCategory: "Error",
        confidence: 0,
        reasoning: `Error analyzing product: ${error instanceof Error ? error.message : "Unknown error"}`,
        needsNewCategory: false,
      }

      this.addLog({
        id: `error_${product.id}_${Date.now()}`,
        timestamp: new Date(),
        productId: product.id,
        action: "error",
        details: { error: error instanceof Error ? error.message : "Unknown error" },
        dryRun: true,
      })

      if (this.adminUser) {
        await aiCategorySafety.logSecurityEvent(
          this.adminUser.id,
          "ai_analysis_error",
          { productId: product.id, error: error instanceof Error ? error.message : "Unknown error" },
          "warning",
        )
      }

      return errorResult
    }
  }

  async createCategory(name: string, description: string, dryRun = true): Promise<number | null> {
    if (dryRun) {
      this.addLog({
        id: `create_category_${Date.now()}`,
        timestamp: new Date(),
        productId: 0,
        action: "created_category",
        details: { name, description, dryRun: true },
        dryRun: true,
      })
      return null
    }

    try {
      const sanitizedName = name.trim().substring(0, 255)
      const sanitizedDescription = description.trim().substring(0, 1000)

      if (sanitizedName.length === 0) {
        throw new Error("Category name cannot be empty")
      }

      const existingCategory = await sql`
        SELECT id FROM categories WHERE LOWER(name) = LOWER(${sanitizedName})
      `

      if (existingCategory.length > 0) {
        throw new Error(`Category "${sanitizedName}" already exists`)
      }

      const slug = sanitizedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")

      const result = await sql.begin(async (sql) => {
        const categoryResult = await sql`
          INSERT INTO categories (name, description, slug, is_active, sort_order, created_at, updated_at)
          VALUES (${sanitizedName}, ${sanitizedDescription}, ${slug}, true, 999, NOW(), NOW())
          RETURNING id
        `

        if (this.adminUser) {
          await sql`
            INSERT INTO category_backups (
              session_id, category_id, category_name, category_description, created_during_session, created_by
            ) VALUES (
              ${this.sessionId}, ${categoryResult[0].id}, ${sanitizedName}, ${sanitizedDescription}, true, ${this.adminUser.id}
            )
          `
        }

        return categoryResult[0]
      })

      const categoryId = result?.id

      this.addLog({
        id: `create_category_${Date.now()}`,
        timestamp: new Date(),
        productId: 0,
        action: "created_category",
        details: { name: sanitizedName, description: sanitizedDescription, categoryId, dryRun: false },
        dryRun: false,
      })

      return categoryId
    } catch (error) {
      this.addLog({
        id: `error_create_category_${Date.now()}`,
        timestamp: new Date(),
        productId: 0,
        action: "error",
        details: { error: error instanceof Error ? error.message : "Unknown error", action: "create_category" },
        dryRun,
      })

      if (this.adminUser) {
        await aiCategorySafety.logSecurityEvent(
          this.adminUser.id,
          "category_creation_error",
          { name, error: error instanceof Error ? error.message : "Unknown error" },
          "error",
        )
      }

      return null
    }
  }

  async updateProductCategory(productId: number, categoryId: number, dryRun = true): Promise<boolean> {
    if (dryRun) {
      this.addLog({
        id: `categorize_${productId}_${Date.now()}`,
        timestamp: new Date(),
        productId,
        action: "categorized",
        details: { categoryId, dryRun: true },
        dryRun: true,
      })
      return true
    }

    try {
      if (!Number.isInteger(productId) || productId <= 0) {
        throw new Error("Invalid product ID")
      }

      if (!Number.isInteger(categoryId) || categoryId <= 0) {
        throw new Error("Invalid category ID")
      }

      const productExists = await sql`
        SELECT id FROM products WHERE id = ${productId}
      `

      if (productExists.length === 0) {
        throw new Error(`Product ${productId} not found`)
      }

      const categoryExists = await sql`
        SELECT id FROM categories WHERE id = ${categoryId} AND is_active = true
      `

      if (categoryExists.length === 0) {
        throw new Error(`Category ${categoryId} not found or inactive`)
      }

      await sql.begin(async (sql) => {
        await sql`
          UPDATE products 
          SET category_id = ${categoryId}, updated_at = NOW()
          WHERE id = ${productId}
        `

        if (this.adminUser) {
          await sql`
            INSERT INTO product_category_backups (
              session_id, product_id, original_category_id, created_by
            ) 
            SELECT ${this.sessionId}, ${productId}, category_id, ${this.adminUser.id}
            FROM products WHERE id = ${productId}
          `
        }
      })

      this.addLog({
        id: `categorize_${productId}_${Date.now()}`,
        timestamp: new Date(),
        productId,
        action: "categorized",
        details: { categoryId, dryRun: false },
        dryRun: false,
      })

      return true
    } catch (error) {
      this.addLog({
        id: `error_categorize_${productId}_${Date.now()}`,
        timestamp: new Date(),
        productId,
        action: "error",
        details: { error: error instanceof Error ? error.message : "Unknown error", action: "categorize" },
        dryRun,
      })

      if (this.adminUser) {
        await aiCategorySafety.logSecurityEvent(
          this.adminUser.id,
          "product_update_error",
          { productId, categoryId, error: error instanceof Error ? error.message : "Unknown error" },
          "error",
        )
      }

      return false
    }
  }

  async runCategorizationPipeline(dryRun = true): Promise<CategorizationResult[]> {
    console.log(`[v0] Starting AI categorization pipeline (dryRun: ${dryRun})`)

    const products = await this.getProducts()
    const categories = await this.getCategories()
    const results: CategorizationResult[] = []

    console.log(`[v0] Found ${products.length} products and ${categories.length} categories`)

    for (const product of products) {
      console.log(`[v0] Analyzing product: ${product.name}`)

      const result = await this.analyzeProduct(product, categories)
      results.push(result)

      if (result.needsNewCategory && !dryRun && result.newCategoryDescription) {
        const newCategoryId = await this.createCategory(result.suggestedCategory, result.newCategoryDescription, dryRun)

        if (newCategoryId) {
          await this.updateProductCategory(product.id, newCategoryId, dryRun)
        }
      } else if (!result.needsNewCategory && !dryRun) {
        const existingCategory = categories.find((c) => c.name === result.suggestedCategory)
        if (existingCategory) {
          await this.updateProductCategory(product.id, existingCategory.id, dryRun)
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    console.log(`[v0] Categorization pipeline completed. Processed ${results.length} products`)
    return results
  }

  private addLog(log: CategorizationLog): void {
    this.logs.push(log)
  }

  getLogs(): CategorizationLog[] {
    return [...this.logs]
  }

  clearLogs(): void {
    this.logs = []
  }

  exportResults(results: CategorizationResult[], format: "json" | "csv" = "json"): string {
    if (format === "csv") {
      const headers = [
        "Product ID",
        "Product Name",
        "Current Category",
        "Suggested Category",
        "Confidence",
        "Needs New Category",
        "Reasoning",
      ]

      const rows = results.map((r) => [
        r.productId,
        `"${r.productName.replace(/"/g, '""')}"`,
        r.currentCategory || "None",
        `"${r.suggestedCategory.replace(/"/g, '""')}"`,
        r.confidence,
        r.needsNewCategory,
        `"${r.reasoning.replace(/"/g, '""')}"`,
      ])

      return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    }

    return JSON.stringify(results, null, 2)
  }
}

export { AIProductCategorizer }
