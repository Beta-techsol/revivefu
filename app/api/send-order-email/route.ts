import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { order, type } = await request.json()

    // Generate email content
    const emailContent = generateOrderEmailContent(order, type)

    console.log("=== ORDER EMAIL NOTIFICATION ===")
    console.log("To:", process.env.ADMIN_EMAIL || "admin@revivefurniture.com")
    console.log("Subject:", emailContent.subject)
    console.log("Order Number:", order.order_number)
    console.log("Customer:", order.customer_name)
    console.log("Total:", `₨${order.total_amount?.toLocaleString()}`)
    console.log("================================")

    // If Resend API key is available, send actual email
    if (process.env.RESEND_API_KEY) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "orders@revivefurniture.com",
            to: [process.env.ADMIN_EMAIL || "admin@revivefurniture.com"],
            subject: emailContent.subject,
            html: emailContent.html,
          }),
        })

        if (!response.ok) {
          console.error("Resend API error:", await response.text())
        } else {
          console.log("Email sent successfully via Resend")
        }
      } catch (resendError) {
        console.error("Resend email error:", resendError)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Email notification processed",
    })
  } catch (error) {
    console.error("Error processing email:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function generateOrderEmailContent(order: any, type: string) {
  const itemsHtml =
    order.items
      ?.map(
        (item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name || item.product_name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₨${item.price?.toLocaleString() || item.unit_price?.toLocaleString()}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₨${((item.price || item.unit_price) * item.quantity)?.toLocaleString()}</td>
    </tr>
  `,
      )
      .join("") || ""

  const subject = `New Order Received - ${order.order_number}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order Notification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #C53D39, #F1BA69); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">New Order Received!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Revive Furniture Store</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #C53D39; margin-top: 0;">Order Details</h2>
          
          <table style="width: 100%; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Order Number:</td>
              <td style="padding: 8px 0;">${order.order_number}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Customer:</td>
              <td style="padding: 8px 0;">${order.customer_name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0;">${order.customer_email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
              <td style="padding: 8px 0;">${order.customer_phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Address:</td>
              <td style="padding: 8px 0;">${order.customer_address}, ${order.customer_city} ${order.customer_zip}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Status:</td>
              <td style="padding: 8px 0;"><span style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${order.status?.toUpperCase()}</span></td>
            </tr>
          </table>

          <h3 style="color: #C53D39;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #C53D39; color: white;">
                <th style="padding: 12px; text-align: left;">Product</th>
                <th style="padding: 12px; text-align: center;">Qty</th>
                <th style="padding: 12px; text-align: right;">Price</th>
                <th style="padding: 12px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #C53D39;">
            <table style="width: 100%;">
              <tr>
                <td style="padding: 5px 0; font-weight: bold;">Subtotal:</td>
                <td style="padding: 5px 0; text-align: right;">₨${order.subtotal?.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold;">Delivery Charge:</td>
                <td style="padding: 5px 0; text-align: right;">₨${order.delivery_charge?.toLocaleString()}</td>
              </tr>
              <tr style="border-top: 2px solid #C53D39;">
                <td style="padding: 10px 0; font-weight: bold; font-size: 18px; color: #C53D39;">Total Amount:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold; font-size: 18px; color: #C53D39;">₨${order.total_amount?.toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <div style="margin-top: 20px; padding: 15px; background: #e0f2fe; border-radius: 6px;">
            <p style="margin: 0; font-weight: bold; color: #0369a1;">Payment Method: Cash on Delivery (COD)</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #0369a1;">Customer will pay ₨${order.total_amount?.toLocaleString()} upon delivery</p>
          </div>

          ${
            order.special_instructions
              ? `
          <div style="margin-top: 15px; padding: 15px; background: #fef7cd; border-radius: 6px;">
            <p style="margin: 0; font-weight: bold; color: #92400e;">Special Instructions:</p>
            <p style="margin: 5px 0 0 0; color: #92400e;">${order.special_instructions}</p>
          </div>
          `
              : ""
          }

          <div style="margin-top: 20px; text-align: center;">
            <p style="color: #666; font-size: 14px;">
              Track this order: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/track-order/${order.order_number}" style="color: #C53D39;">${order.order_number}</a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  return { subject, html }
}
