import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "Database configuration missing",
        },
        { status: 500 },
      )
    }

    console.log("Setting up payment_status column...")

    // Check if payment_status column exists
    const columnCheck = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orders' AND column_name = 'payment_status'
    `

    if (columnCheck.length === 0) {
      // Add payment_status column
      await sql`
        ALTER TABLE orders 
        ADD COLUMN payment_status VARCHAR(50) DEFAULT 'unpaid'
      `
      console.log("Added payment_status column")
    }

    // Update existing records based on order status
    await sql`
      UPDATE orders 
      SET payment_status = CASE 
        WHEN status IN ('delivered', 'completed') THEN 'paid'
        WHEN status IN ('processing', 'shipped') THEN 'pending'
        ELSE 'unpaid'
      END
      WHERE payment_status IS NULL OR payment_status = ''
    `

    // Create index for better performance
    try {
      await sql`
        CREATE INDEX IF NOT EXISTS idx_orders_payment_status 
        ON orders(payment_status)
      `
    } catch (indexError) {
      console.log("Index might already exist:", indexError)
    }

    return NextResponse.json({
      success: true,
      message: "Payment status column setup completed successfully",
    })
  } catch (error) {
    console.error("Error setting up payment status:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to setup payment status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
