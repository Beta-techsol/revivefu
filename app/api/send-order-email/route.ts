import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order, type } = body

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: "Order data is required",
        },
        { status: 400 },
      )
    }

    // Skip email if no API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.log("Resend API key not configured, skipping email")
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
          <h2 style="color: #333;">New Order Received</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${order.order_number}</p>
            <p><strong>Customer:</strong> ${order.customer_name}</p>
            <p><strong>Email:</strong> ${order.customer_email}</p>
            <p><strong>Phone:</strong> ${order.customer_phone}</p>
            <p><strong>Total Amount:</strong> $${order.total_amount}</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Shipping Address</h3>
            <p>${order.customer_address}</p>
            <p>${order.customer_city}, ${order.customer_zip}</p>
            ${order.customer_landmark ? `<p><strong>Landmark:</strong> ${order.customer_landmark}</p>` : ""}
          </div>

          ${
            order.items && order.items.length > 0
              ? `
          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
            <h3>Order Items</h3>
            ${order.items
              .map(
                (item: any) => `
              <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <p><strong>${item.name}</strong></p>
                <p>Quantity: ${item.quantity} × $${item.price} = $${item.quantity * item.price}</p>
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
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4>Special Instructions</h4>
            <p>${order.special_instructions}</p>
          </div>
          `
              : ""
          }

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/orders" 
               style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Order in Admin Panel
            </a>
          </div>
        </div>
      `
    }

    // Send email to admin
    const emailResult = await resend.emails.send({
      from: `Orders <orders@${process.env.NEXT_PUBLIC_BASE_URL?.replace("https://", "").replace("http://", "") || "localhost"}>`,
      to: [adminEmail],
      subject,
      html: htmlContent,
    })

    // Send confirmation email to customer
    const customerEmailResult = await resend.emails.send({
      from: `Orders <orders@${process.env.NEXT_PUBLIC_BASE_URL?.replace("https://", "").replace("http://", "") || "localhost"}>`,
      to: [order.customer_email],
      subject: `Order Confirmation - ${order.order_number}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for your order!</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Confirmation</h3>
            <p><strong>Order Number:</strong> ${order.order_number}</p>
            <p><strong>Total Amount:</strong> $${order.total_amount}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/track-order/${order.order_number}" 
               style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Track Your Order
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            You can track your order status anytime using the link above or by visiting our website.
          </p>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      data: {
        adminEmail: emailResult,
        customerEmail: customerEmailResult,
      },
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
