import { Resend } from "resend"

function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const verificationUrl = `${baseUrl}/auth/verify-email?token=${token}`

    const resend = getResendClient()
    if (!resend) {
      console.warn("RESEND_API_KEY not configured, skipping email")
      return true
    }
    const { data, error } = await resend.emails.send({
      from: "noreply@yourdomain.com",
      to: [email],
      subject: "Verify your email address",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #333; text-align: center;">Verify Your Email Address</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Thank you for registering! Please click the button below to verify your email address:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:
            <br>
            <a href="${verificationUrl}">${verificationUrl}</a>
          </p>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 24 hours.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("Email sending error:", error)
      return false
    }

    console.log("Verification email sent:", data)
    return true
  } catch (error) {
    console.error("Email service error:", error)
    return false
  }
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`

    const resend = getResendClient()
    if (!resend) {
      console.warn("RESEND_API_KEY not configured, skipping email")
      return true
    }
    const { data, error } = await resend.emails.send({
      from: "noreply@yourdomain.com",
      to: [email],
      subject: "Reset your password",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #333; text-align: center;">Reset Your Password</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            You requested to reset your password. Click the button below to set a new password:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:
            <br>
            <a href="${resetUrl}">${resetUrl}</a>
          </p>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("Password reset email error:", error)
      return false
    }

    console.log("Password reset email sent:", data)
    return true
  } catch (error) {
    console.error("Email service error:", error)
    return false
  }
}
