import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_URL not configured",
        },
        { status: 500 },
      )
    }

    const sql = neon(process.env.DATABASE_URL)

    // Check if payment_status column exists
    const columnCheck = await sql`
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'payment_status'
      ) as column_exists
    `

    if (!columnCheck[0]?.column_exists) {
      // Add the column
      await sql`ALTER TABLE orders ADD COLUMN payment_status VARCHAR(50) DEFAULT 'unpaid'`
      console.log("Added payment_status column")
    }

    // Update existing records
    await sql`
      UPDATE orders 
      SET payment_status = CASE 
        WHEN status = 'completed' OR status = 'delivered' THEN 'paid'
        WHEN status = 'cancelled' OR status = 'refunded' THEN 'refunded'
        WHEN status = 'processing' OR status = 'shipped' THEN 'pending'
        ELSE 'unpaid'
      END
      WHERE payment_status IS NULL OR payment_status = ''
    `

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email)`
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`

    // Verify the setup
    const verification = await sql`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as paid_orders,
        COUNT(CASE WHEN payment_status = 'unpaid' THEN 1 END) as unpaid_orders,
        COUNT(CASE WHEN payment_status = 'pending' THEN 1 END) as pending_orders
      FROM orders
    `

    return NextResponse.json({
      success: true,
      message: "Payment status column setup completed",
      verification: verification[0],
    })
  } catch (error) {
    console.error("Setup payment status error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to setup payment status column",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
