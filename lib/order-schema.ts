import { sql } from "@/lib/db"

let schemaEnsured = false

/**
 * Safely ensures required columns exist on orders and order_items when backed by Postgres.
 * No-op in mock DB mode or after first successful check in a server lifecycle.
 */
export async function ensureOrderSchemaColumns() {
  if (schemaEnsured || !process.env.DATABASE_URL) {
    schemaEnsured = true
    return
  }

  try {
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_address TEXT`
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_city VARCHAR(100)`
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_zip VARCHAR(50)`
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_landmark TEXT`
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS special_instructions TEXT`
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(12,2) DEFAULT 0`
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_charge DECIMAL(12,2) DEFAULT 0`
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount DECIMAL(12,2) DEFAULT 0`
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS advance_amount DECIMAL(12,2) DEFAULT 0`
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS remaining_amount DECIMAL(12,2) DEFAULT 0`
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(100) DEFAULT 'advance_50_cod_50'`
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending'`

    await sql`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_id INTEGER`
    await sql`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_name VARCHAR(255)`
    await sql`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS unit_price DECIMAL(12,2)`
    await sql`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS total_price DECIMAL(12,2)`
    await sql`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_image TEXT`
    await sql`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS variant_info TEXT`

    await sql`
      CREATE TABLE IF NOT EXISTS order_status_history (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        status VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    schemaEnsured = true
  } catch (err) {
    console.warn("ensureOrderSchemaColumns warning:", err)
  }
}

export function extractFirstImage(rawImages: any): string | null {
  if (!rawImages) return null
  if (Array.isArray(rawImages)) {
    const first = rawImages.find((img) => typeof img === "string" && img.trim().length > 0)
    return first || null
  }
  if (typeof rawImages === "string") {
    const trimmed = rawImages.trim()
    if (!trimmed) return null
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
          return parsed[0]
        }
      } catch {
        // try single-quoted JSON array
        try {
          const parsed = JSON.parse(trimmed.replace(/'/g, '"'))
          if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
            return parsed[0]
          }
        } catch {
          return null
        }
      }
    }
    return trimmed
  }
  return null
}

export function parseVariantInfo(rawVariant: any): string | null {
  if (!rawVariant) return null
  if (typeof rawVariant === "string") {
    const trimmed = rawVariant.trim()
    if (!trimmed) return null
    if (trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed)
        const parts = [parsed.color, parsed.variant].filter((v) => typeof v === "string" && v.trim().length > 0)
        return parts.length > 0 ? parts.join(" • ") : null
      } catch {
        return trimmed
      }
    }
    return trimmed
  }
  if (typeof rawVariant === "object") {
    const parts = [rawVariant.color, rawVariant.variant].filter((v) => typeof v === "string" && v.trim().length > 0)
    return parts.length > 0 ? parts.join(" • ") : null
  }
  return null
}
