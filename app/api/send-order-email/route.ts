import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { order, type } = await request.json()

    if (!process.env.RESEND_API_KEY) {
      console.log("Email service not configured - skipping email")
      return NextResponse.json({ success: true, message: "Email service not configured" })
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com"

    if (type === "new_order") {
      // Send email to admin about new order
      const adminEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C53D39;">New Order Received</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${order.order_number}</p>
            <p><strong>Customer:</strong> ${order.customer_name}</p>
            <p><strong>Email:</strong> ${order.customer_email}</p>
            <p><strong>Phone:</strong> ${order.customer_phone}</p>
            <p><strong>Address:</strong> ${order.customer_address}, ${order.customer_city}</p>
            <p><strong>Total Amount:</strong> ₨${order.total_amount.toLocaleString()}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3>Items Ordered</h3>
            ${
              order.items
                ?.map(
                  (item: any) => `
              <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <p><strong>${item.name}</strong></p>
                <p>Quantity: ${item.quantity} × ₨${item.price.toLocaleString()} = ₨${(item.quantity * item.price).toLocaleString()}</p>
              </div>
            `,
                )
                .join("") || ""
            }
          </div>
          
          <p style="margin-top: 20px;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/orders" 
               style="background: #C53D39; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
              View Order in Admin Panel
            </a>
          </p>
        </div>
      `

      await resend.emails.send({
        from: `Revive Furniture <noreply@${process.env.NEXT_PUBLIC_BASE_URL?.replace("https://", "") || "localhost"}>`,
        to: [adminEmail],
        subject: `New Order: ${order.order_number}`,
        html: adminEmailHtml,
      })

      // Send confirmation email to customer
      const customerEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C53D39;">Order Confirmation</h2>
          <p>Dear ${order.customer_name},</p>
          <p>Thank you for your order! We have received your order and it is being processed.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${order.order_number}</p>
            <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ₨${order.total_amount.toLocaleString()}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3>Items Ordered</h3>
            ${
              order.items
                ?.map(
                  (item: any) => `
              <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <p><strong>${item.name}</strong></p>
                <p>Quantity: ${item.quantity} × ₨${item.price.toLocaleString()} = ₨${(item.quantity * item.price).toLocaleString()}</p>
              </div>
            `,
                )
                .join("") || ""
            }
          </div>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Delivery Address</h3>
            <p>${order.customer_address}<br>
            ${order.customer_city} ${order.customer_zip}</p>
          </div>
          
          <p style="margin-top: 20px;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/track-order/${order.order_number}" 
               style="background: #C53D39; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
              Track Your Order
            </a>
          </p>
          
          <p style="margin-top: 20px; color: #666;">
            If you have any questions, please contact us at ${adminEmail}
          </p>
        </div>
      `

      await resend.emails.send({
        from: `Revive Furniture <noreply@${process.env.NEXT_PUBLIC_BASE_URL?.replace("https://", "") || "localhost"}>`,
        to: [order.customer_email],
        subject: `Order Confirmation - ${order.order_number}`,
        html: customerEmailHtml,
      })
    }

    return NextResponse.json({ success: true, message: "Emails sent successfully" })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ success: true, message: "Email sending failed but order was created" })
  }
}
