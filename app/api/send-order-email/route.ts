import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order, type } = body

    // If Resend is not configured, just return success (email is optional)
    if (!resend || !process.env.RESEND_API_KEY) {
      console.log("Email service not configured, skipping email send")
      return NextResponse.json({
        success: true,
        message: "Email service not configured",
      })
    }

    const subject =
      type === "new_order" ? `New Order Received - ${order.order_number}` : `Order Update - ${order.order_number}`

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #C53D39;">Order ${type === "new_order" ? "Confirmation" : "Update"}</h2>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> ${order.order_number}</p>
          <p><strong>Customer:</strong> ${order.customer_name}</p>
          <p><strong>Email:</strong> ${order.customer_email}</p>
          <p><strong>Phone:</strong> ${order.customer_phone}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Total Amount:</strong> Rs. ${order.total_amount}</p>
        </div>

        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Delivery Address</h3>
          <p>${order.customer_address}</p>
          <p>${order.customer_city} ${order.customer_zip}</p>
          ${order.customer_landmark ? `<p><strong>Landmark:</strong> ${order.customer_landmark}</p>` : ""}
        </div>

        ${
          order.items && order.items.length > 0
            ? `
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Items</h3>
          ${order.items
            .map(
              (item: any) => `
            <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
              <p><strong>${item.product_name}</strong></p>
              <p>Quantity: ${item.quantity} × Rs. ${item.unit_price} = Rs. ${item.total_price}</p>
            </div>
          `,
            )
            .join("")}
        </div>
        `
            : ""
        }

        ${
          order.special_instructions
            ? `
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Special Instructions</h3>
          <p>${order.special_instructions}</p>
        </div>
        `
            : ""
        }

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/track-order/${order.order_number}" 
             style="background: #C53D39; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Track Your Order
          </a>
        </div>

        <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>Thank you for choosing Revive Furniture!</p>
          <p>For any queries, contact us at ${process.env.ADMIN_EMAIL || "support@revivefurniture.com"}</p>
        </div>
      </div>
    `

    // Send email to customer
    await resend.emails.send({
      from: `Revive Furniture <${process.env.ADMIN_EMAIL || "noreply@revivefurniture.com"}>`,
      to: [order.customer_email],
      subject: subject,
      html: emailHtml,
    })

    // Send notification to admin (if different from customer)
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL !== order.customer_email) {
      await resend.emails.send({
        from: `Revive Furniture <${process.env.ADMIN_EMAIL}>`,
        to: [process.env.ADMIN_EMAIL],
        subject: `[ADMIN] ${subject}`,
        html: emailHtml,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
