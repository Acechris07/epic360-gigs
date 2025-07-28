import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

export interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from = "Epic360 Gigs <noreply@epic360gigs.com>" }: EmailOptions) {
  try {
    // If Resend is not configured, just log the email instead of sending
    if (!resend) {
      console.log("Email service not configured. Would send email:", { to, subject, from })
      return { success: true, data: { id: "mock-email-id" } }
    }

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })

    if (error) {
      console.error("Email sending error:", error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    return { success: true, data }
  } catch (error) {
    console.error("Email service error:", error)
    // Don't throw error to avoid breaking the signup process
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// EmailService object for easier imports
export const EmailService = {
  sendWelcomeEmail: async (email: string, name: string) => {
    const html = getWelcomeEmailTemplate(name)
    return sendEmail({
      to: email,
      subject: "Welcome to Epic360 Gigs!",
      html,
    })
  },
  sendPasswordResetEmail: async (email: string, resetLink: string) => {
    const html = getPasswordResetTemplate(resetLink)
    return sendEmail({
      to: email,
      subject: "Reset Your Password - Epic360 Gigs",
      html,
    })
  },
  sendEmailVerification: async (email: string, verificationLink: string, name: string) => {
    const html = getEmailVerificationTemplate(verificationLink, name)
    return sendEmail({
      to: email,
      subject: "Verify Your Email - Epic360 Gigs",
      html,
    })
  },
  sendOrderNotification: async (email: string, orderDetails: any, type: 'new_order' | 'order_update' | 'order_completed') => {
    const html = getOrderNotificationTemplate(orderDetails, type)
    const subject = getOrderNotificationSubject(type)
    return sendEmail({
      to: email,
      subject,
      html,
    })
  },
  sendMessageNotification: async (email: string, senderName: string, messagePreview: string, conversationLink: string) => {
    const html = getMessageNotificationTemplate(senderName, messagePreview, conversationLink)
    return sendEmail({
      to: email,
      subject: `New message from ${senderName} - Epic360 Gigs`,
      html,
    })
  },
  sendPaymentConfirmation: async (email: string, paymentDetails: any) => {
    const html = getPaymentConfirmationTemplate(paymentDetails)
    return sendEmail({
      to: email,
      subject: "Payment Confirmation - Epic360 Gigs",
      html,
    })
  },
}

export function getWelcomeEmailTemplate(name: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Epic360 Gigs</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Epic360 Gigs!</h1>
            <p>Your freelance journey starts here</p>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>Thank you for joining Epic360 Gigs, the premier platform for connecting talented freelancers with amazing opportunities.</p>
            
            <p>Here's what you can do next:</p>
            <ul>
              <li>Complete your profile to stand out</li>
              <li>Browse available gigs in your expertise</li>
              <li>Start building your reputation</li>
              <li>Connect with clients worldwide</li>
            </ul>
            
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" class="button">Get Started</a>
            
            <p>If you have any questions, our support team is here to help!</p>
            
            <p>Best regards,<br>The Epic360 Gigs Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Epic360 Gigs. All rights reserved.</p>
            <p>You received this email because you signed up for Epic360 Gigs.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function getPasswordResetTemplate(resetLink: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password - Epic360 Gigs</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>You requested to reset your password for your Epic360 Gigs account.</p>
            
            <p>Click the button below to reset your password:</p>
            
            <a href="${resetLink}" class="button">Reset Password</a>
            
            <div class="warning">
              <strong>Security Notice:</strong>
              <ul>
                <li>This link will expire in 1 hour</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Never share this link with anyone</li>
              </ul>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetLink}</p>
            
            <p>Best regards,<br>The Epic360 Gigs Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Epic360 Gigs. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function getEmailVerificationTemplate(verificationLink: string, name: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your Email - Epic360 Gigs</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email Address</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>Welcome to Epic360 Gigs! To complete your registration, please verify your email address.</p>
            
            <p>Click the button below to verify your email:</p>
            
            <a href="${verificationLink}" class="button">Verify Email</a>
            
            <div class="warning">
              <strong>Important:</strong>
              <ul>
                <li>This link will expire in 24 hours</li>
                <li>If you didn't create an account, please ignore this email</li>
                <li>Verifying your email helps keep your account secure</li>
              </ul>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${verificationLink}</p>
            
            <p>Best regards,<br>The Epic360 Gigs Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Epic360 Gigs. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function getOrderNotificationTemplate(orderDetails: any, type: 'new_order' | 'order_update' | 'order_completed') {
  const getTypeContent = () => {
    switch (type) {
      case 'new_order':
        return {
          title: 'New Order Received!',
          message: 'You have received a new order for your service.',
          color: '#10b981'
        }
      case 'order_update':
        return {
          title: 'Order Update',
          message: 'There has been an update to your order.',
          color: '#f59e0b'
        }
      case 'order_completed':
        return {
          title: 'Order Completed!',
          message: 'Your order has been marked as completed.',
          color: '#059669'
        }
    }
  }

  const content = getTypeContent()

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${content.title} - Epic360 Gigs</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, ${content.color}, ${content.color}dd); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: ${content.color}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .order-details { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid ${content.color}; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${content.title}</h1>
          </div>
          <div class="content">
            <p>${content.message}</p>
            
            <div class="order-details">
              <h3>Order Details:</h3>
              <p><strong>Order ID:</strong> ${orderDetails.id}</p>
              <p><strong>Service:</strong> ${orderDetails.service_title || 'N/A'}</p>
              <p><strong>Amount:</strong> $${orderDetails.amount || 'N/A'}</p>
              <p><strong>Status:</strong> ${orderDetails.status || 'N/A'}</p>
            </div>
            
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/orders/${orderDetails.id}" class="button">View Order</a>
            
            <p>Best regards,<br>The Epic360 Gigs Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Epic360 Gigs. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function getOrderNotificationSubject(type: 'new_order' | 'order_update' | 'order_completed'): string {
  switch (type) {
    case 'new_order':
      return 'New Order Received - Epic360 Gigs'
    case 'order_update':
      return 'Order Update - Epic360 Gigs'
    case 'order_completed':
      return 'Order Completed - Epic360 Gigs'
  }
}

export function getMessageNotificationTemplate(senderName: string, messagePreview: string, conversationLink: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Message - Epic360 Gigs</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .message-preview { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Message</h1>
            <p>You have a new message from ${senderName}</p>
          </div>
          <div class="content">
            <p>You've received a new message in your Epic360 Gigs conversation.</p>
            
            <div class="message-preview">
              <p><strong>From:</strong> ${senderName}</p>
              <p><strong>Message:</strong> ${messagePreview}</p>
            </div>
            
            <a href="${conversationLink}" class="button">View Conversation</a>
            
            <p>Best regards,<br>The Epic360 Gigs Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Epic360 Gigs. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function getPaymentConfirmationTemplate(paymentDetails: any) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Confirmation - Epic360 Gigs</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .payment-details { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #059669; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Confirmation</h1>
            <p>Your payment has been processed successfully</p>
          </div>
          <div class="content">
            <p>Thank you for your payment! Your transaction has been completed successfully.</p>
            
            <div class="payment-details">
              <h3>Payment Details:</h3>
              <p><strong>Transaction ID:</strong> ${paymentDetails.id || 'N/A'}</p>
              <p><strong>Amount:</strong> $${paymentDetails.amount || 'N/A'}</p>
              <p><strong>Date:</strong> ${paymentDetails.date || 'N/A'}</p>
              <p><strong>Status:</strong> ${paymentDetails.status || 'Completed'}</p>
            </div>
            
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" class="button">View Dashboard</a>
            
            <p>Best regards,<br>The Epic360 Gigs Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Epic360 Gigs. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}
