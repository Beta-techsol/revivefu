import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order, type } = body

    // If no Resend API key, just return success (email is optional)
    if (!resend || !process.env.RESEND_API_KEY) {
      console.log("Email service not configured, skipping email send")
      return NextResponse.json({
        success: true,
        message: "Email service not configured",
      })
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com"

    let subject = ""
    let htmlContent = ""

    if (type === "new_order") {
      subject = `New Order Received - ${order.order_number}`
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C53D39;">New Order Received</h2>
          <p><strong>Order Number:</strong> ${order.order_number}</p>
          <p><strong>Customer:</strong> ${order.customer_name}</p>
          <p><strong>Email:</strong> ${order.customer_email}</p>
          <p><strong>Phone:</strong> ${order.customer_phone}</p>
          <p><strong>Total Amount:</strong> ₨${order.total_amount?.toLocaleString()}</p>
          
          <h3>Customer Address:</h3>
          <p>${order.customer_address}<br>
          ${order.customer_city} ${order.customer_zip}</p>
          
          ${
            order.items && order.items.length > 0
              ? `
          <h3>Order Items:</h3>
          <ul>
            ${order.items
              .map(
                (item: any) => `
              <li>${item.name} - Qty: ${item.quantity} - ₨${(item.price * item.quantity).toLocaleString()}</li>
            `,
              )
              .join("")}
          </ul>
          `
              : ""
          }
          
          ${
            order.special_instructions
              ? `
          <h3>Special Instructions:</h3>
          <p>${order.special_instructions}</p>
          `
              : ""
          }
          
          <p style="margin-top: 20px;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/orders" 
               style="background-color: #C53D39; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View in Admin Panel
            </a>
          </p>
        </div>
      `
    }

    // Send email to admin
    await resend.emails.send({
      from: `Orders <orders@${process.env.NEXT_PUBLIC_BASE_URL?.replace("https://", "").replace("http://", "") || "localhost"}>`,
      to: [adminEmail],
      subject,
      html: htmlContent,
    })

    // Send confirmation email to customer
    if (order.customer_email) {
      const customerSubject = `Order Confirmation - ${order.order_number}`
      const customerHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C53D39;">Order Confirmation</h2>
          <p>Dear ${order.customer_name},</p>
          <p>Thank you for your order! We have received your order and it is being processed.</p>
          
          <p><strong>Order Number:</strong> ${order.order_number}</p>
          <p><strong>Total Amount:</strong> ₨${order.total_amount?.toLocaleString()}</p>
          
          <p>You can track your order status at:</p>
          <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/track-order/${order.order_number}">Track Your Order</a></p>
          
          <p>We will notify you when your order ships.</p>
          
          <p>Best regards,<br>Revive Furniture Team</p>
        </div>
      `

      await resend.emails.send({
        from: `Revive Furniture <orders@${process.env.NEXT_PUBLIC_BASE_URL?.replace("https://", "").replace("http://", "") || "localhost"}>`,
        to: [order.customer_email],
        subject: customerSubject,
        html: customerHtml,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Emails sent successfully",
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
