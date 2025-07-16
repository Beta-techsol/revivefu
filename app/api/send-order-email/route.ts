import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order, type } = body

    // If no Resend API key is configured, just return success
    if (!resend || !process.env.RESEND_API_KEY) {
      console.log("Email service not configured, skipping email send")
      return NextResponse.json({
        success: true,
        message: "Email service not configured",
      })
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@revivefurniture.com"

    if (type === "new_order") {
      // Send email to admin about new order
      await resend.emails.send({
        from: "orders@revivefurniture.com",
        to: adminEmail,
        subject: `New Order Received - ${order.order_number}`,
        html: `
          <h2>New Order Received</h2>
          <p><strong>Order Number:</strong> ${order.order_number}</p>
          <p><strong>Customer:</strong> ${order.customer_name}</p>
          <p><strong>Email:</strong> ${order.customer_email}</p>
          <p><strong>Phone:</strong> ${order.customer_phone}</p>
          <p><strong>Total Amount:</strong> Rs. ${order.total_amount}</p>
          <p><strong>Address:</strong> ${order.customer_address}, ${order.customer_city}</p>
          
          <h3>Items:</h3>
          <ul>
            ${
              order.items
                ?.map(
                  (item: any) => `
              <li>${item.name} - Qty: ${item.quantity} - Rs. ${item.price}</li>
            `,
                )
                .join("") || ""
            }
          </ul>
          
          <p>Please check the admin panel for more details.</p>
        `,
      })

      // Send confirmation email to customer
      await resend.emails.send({
        from: "orders@revivefurniture.com",
        to: order.customer_email,
        subject: `Order Confirmation - ${order.order_number}`,
        html: `
          <h2>Order Confirmation</h2>
          <p>Dear ${order.customer_name},</p>
          <p>Thank you for your order! Your order has been received and is being processed.</p>
          
          <p><strong>Order Number:</strong> ${order.order_number}</p>
          <p><strong>Total Amount:</strong> Rs. ${order.total_amount}</p>
          
          <h3>Items Ordered:</h3>
          <ul>
            ${
              order.items
                ?.map(
                  (item: any) => `
              <li>${item.name} - Qty: ${item.quantity} - Rs. ${item.price}</li>
            `,
                )
                .join("") || ""
            }
          </ul>
          
          <p>You can track your order at: ${process.env.NEXT_PUBLIC_BASE_URL}/track-order/${order.order_number}</p>
          
          <p>Thank you for choosing Revive Furniture!</p>
        `,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Emails sent successfully",
    })
  } catch (error) {
    console.error("Error sending emails:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send emails",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
