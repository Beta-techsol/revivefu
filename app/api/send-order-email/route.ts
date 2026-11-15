import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { BANK_ACCOUNT_DETAILS, SUPPORT_CONTACT, calculatePaymentBreakdown } from "@/lib/payment-utils"

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

    if (!process.env.RESEND_API_KEY) {
      console.log("Resend API key not configured, skipping email")
      return NextResponse.json({
        success: true,
        message: "Email skipped - no API key configured",
      })
    }

    const totalNum = Number(order.total_amount) || 0
    const { advanceAmount, remainingAmount } = calculatePaymentBreakdown(totalNum)

    const subject =
      type === "new_order" ? `New Order Received - ${order.order_number}` : `Order Update - ${order.order_number}`

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #C53D39;">Order ${type === "new_order" ? "Confirmation" : "Update"}</h2>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> ${order.order_number}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Total Order Amount:</strong> ₨${totalNum.toLocaleString()}</p>
          <p><strong>50% Advance Payment:</strong> ₨${advanceAmount.toLocaleString()}</p>
          <p><strong>Remaining 50% on Delivery:</strong> ₨${remainingAmount.toLocaleString()}</p>
        </div>

        <div style="background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #fde68a;">
          <h3>Payment Instructions</h3>
          <p>To confirm your order, please transfer 50% of the total order amount (₨${advanceAmount.toLocaleString()}) to the bank account below and send the payment screenshot via WhatsApp (${SUPPORT_CONTACT.whatsappDisplay}) or email (${SUPPORT_CONTACT.email}).</p>
          <p><strong>Bank:</strong> ${BANK_ACCOUNT_DETAILS.bankName}<br/>
          <strong>Account Title:</strong> ${BANK_ACCOUNT_DETAILS.accountTitle}<br/>
          <strong>IBAN:</strong> ${BANK_ACCOUNT_DETAILS.iban}<br/>
          <strong>Account Number:</strong> ${BANK_ACCOUNT_DETAILS.accountNumber}</p>
        </div>

        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> ${order.customer_name}</p>
          <p><strong>Email:</strong> ${order.customer_email}</p>
          <p><strong>Phone:</strong> ${order.customer_phone}</p>
          <p><strong>Address:</strong> ${order.customer_address}</p>
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
              <p>Quantity: ${item.quantity} × ₨${Number(item.unit_price).toLocaleString()} = ₨${Number(item.total_price).toLocaleString()}</p>
            </div>
          `,
            )
            .join("")}
        </div>
        `
            : ""
        }

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk"}/track-order/${order.order_number}" 
             style="background: #C53D39; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Track Your Order
          </a>
        </div>

        <p style="color: #666; font-size: 14px;">
          Thank you for your business!<br>
          Revive Furniture Team
        </p>
      </div>
    `

    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: "orders@revivefurniture.com",
      to: [order.customer_email],
      subject,
      html: emailHtml,
    })

    if (process.env.ADMIN_EMAIL && type === "new_order") {
      await resend.emails.send({
        from: "orders@revivefurniture.com",
        to: [process.env.ADMIN_EMAIL],
        subject: `New Order Alert - ${order.order_number}`,
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2 style="color: #C53D39;">New Order Received</h2>
            <p>A new order has been placed:</p>
            <ul>
              <li><strong>Order Number:</strong> ${order.order_number}</li>
              <li><strong>Customer:</strong> ${order.customer_name}</li>
              <li><strong>Email:</strong> ${order.customer_email}</li>
              <li><strong>Total:</strong> ₨${totalNum.toLocaleString()}</li>
            </ul>
            <p><a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk"}/admin/orders">View in Admin Panel</a></p>
          </div>
        `,
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
