import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const transactionId = params.id
    const orderId = transactionId.replace("TXN-", "") // Remove TXN- prefix to get order ID
    const body = await request.json()

    console.log("Updating transaction:", transactionId, "with data:", body)

    const { payment_method, payment_status } = body

    // Update the order's payment method
    const updateResult = await sql`
      UPDATE orders 
      SET 
        payment_method = ${payment_method},
        updated_at = NOW()
      WHERE id = ${orderId}
      RETURNING *
    `

    if (updateResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Transaction not found",
        },
        { status: 404 },
      )
    }

    // Create a payment update record (you might want to create a separate table for this)
    // For now, we'll add it to order status history
    try {
      await sql`
        INSERT INTO order_status_history (order_id, status, description, created_at)
        VALUES (${orderId}, ${payment_status}, ${"Payment method updated to " + payment_method}, NOW())
      `
    } catch (historyError) {
      console.error("Error adding payment update to history:", historyError)
    }

    const updatedOrder = updateResult[0]
    console.log("Transaction updated successfully:", updatedOrder)

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: "Payment details updated successfully",
    })
  } catch (error) {
    console.error("Error updating transaction:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update transaction",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
