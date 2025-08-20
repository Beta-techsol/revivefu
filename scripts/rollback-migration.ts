import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// This script helps rollback if something goes wrong
// It creates a backup before migration and can restore from it

async function createBackup() {
  try {
    console.log("[v0] Creating backup of current image URLs...")

    // Create backup table
    await sql`
      CREATE TABLE IF NOT EXISTS image_migration_backup (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        table_name VARCHAR(50) NOT NULL,
        record_id UUID NOT NULL,
        field_name VARCHAR(50) NOT NULL,
        old_value TEXT,
        new_value TEXT,
        migrated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("[v0] ✅ Backup table created successfully")
  } catch (error) {
    console.error("[v0] Error creating backup:", error)
    throw error
  }
}

async function restoreFromBackup() {
  try {
    console.log("[v0] Restoring images from backup...")

    // Restore products
    const productBackups = await sql`
      SELECT record_id, old_value 
      FROM image_migration_backup 
      WHERE table_name = 'products' AND field_name = 'images'
    `

    for (const backup of productBackups) {
      await sql`
        UPDATE products 
        SET images = ${backup.old_value}
        WHERE id = ${backup.record_id}
      `
    }

    console.log(`[v0] ✅ Restored ${productBackups.length} products`)

    // Restore variants
    const variantBackups = await sql`
      SELECT record_id, old_value 
      FROM image_migration_backup 
      WHERE table_name = 'product_variants' AND field_name = 'image_url'
    `

    for (const backup of variantBackups) {
      await sql`
        UPDATE product_variants 
        SET image_url = ${backup.old_value}
        WHERE id = ${backup.record_id}
      `
    }

    console.log(`[v0] ✅ Restored ${variantBackups.length} variants`)

    // Restore categories
    const categoryBackups = await sql`
      SELECT record_id, old_value 
      FROM image_migration_backup 
      WHERE table_name = 'categories' AND field_name = 'image_url'
    `

    for (const backup of categoryBackups) {
      await sql`
        UPDATE categories 
        SET image_url = ${backup.old_value}
        WHERE id = ${backup.record_id}
      `
    }

    console.log(`[v0] ✅ Restored ${categoryBackups.length} categories`)
  } catch (error) {
    console.error("[v0] Error restoring from backup:", error)
    throw error
  }
}

// Run backup creation
createBackup().catch(console.error)
