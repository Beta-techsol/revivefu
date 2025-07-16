import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order, type } = body

    // Skip email sending if RESEND_API_KEY is not configured
    if (!process.env.RESEND_API_KEY) {
      console.log("Email sending skipped - RESEND_API_KEY not configured")
      return NextResponse.json({
        success: true,
        message: "Email sending skipped - not configured",
      })
    }

    // If Resend is configured, attempt to send email
    const { Resend } = await import("resend")
    const resend = new Resend(process.env.RESEND_API_KEY)

    const adminEmail = process.env.ADMIN_EMAIL || "admin@revivefurniture.com"

    if (type === "new_order") {
      // Send email to admin about new order
      await resend.emails.send({
        from: "orders@revivefurniture.com",
        to: [adminEmail],
        subject: `New Order Received - ${order.order_number}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #C53D39;">New Order Received</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Order Details</h3>
              <p><strong>Order Number:</strong> ${order.order_number}</p>
              <p><strong>Customer:</strong> ${order.customer_name}</p>
              <p><strong>Email:</strong> ${order.customer_email}</p>
              <p><strong>Phone:</strong> ${order.customer_phone}</p>
              <p><strong>Address:</strong> ${order.customer_address}, ${order.customer_city} ${order.customer_zip}</p>
              <p><strong>Total Amount:</strong> ₨${order.total_amount.toLocaleString()}</p>
              <p><strong>Payment Method:</strong> Cash on Delivery</p>
            </div>
            
            <div style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
              <h3>Items Ordered</h3>
              ${order.items
                .map(
                  (item: any) => `
                <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                  <p><strong>${item.name}</strong></p>
                  <p>Quantity: ${item.quantity} | Price: ₨${item.price.toLocaleString()}</p>
                  <p>Total: ₨${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              `,
                )
                .join("")}
            </div>
            
            <p style="margin-top: 20px;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/orders" 
                 style="background: #C53D39; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                View Order in Admin Panel
              </a>
            </p>
          </div>
        `,
      })

      // Send confirmation email to customer
      await resend.emails.send({
        from: "orders@revivefurniture.com",
        to: [order.customer_email],
        subject: `Order Confirmation - ${order.order_number}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #C53D39;">Thank you for your order!</h2>
            <p>Dear ${order.customer_name},</p>
            <p>Your order has been successfully placed and will be delivered within 3-7 business days.</p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Order Summary</h3>
              <p><strong>Order Number:</strong> ${order.order_number}</p>
              <p><strong>Total Amount:</strong> ₨${order.total_amount.toLocaleString()}</p>
              <p><strong>Payment Method:</strong> Cash on Delivery</p>
              <p><strong>Delivery Address:</strong> ${order.customer_address}, ${order.customer_city} ${order.customer_zip}</p>
            </div>
            
            <p>Our delivery team will contact you before arrival. You can track your order status at:</p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/track-order?order=${order.order_number}" 
                 style="background: #C53D39; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                Track Your Order
              </a>
            </p>
            
            <p>Thank you for choosing Revive Furniture!</p>
          </div>
        `,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Emails sent successfully",
    })
  } catch (error) {
    console.error("Email sending failed:", error)
    // Don't fail the order creation if email fails
    return NextResponse.json({
      success: true,
      message: "Email sending failed but order was created",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
