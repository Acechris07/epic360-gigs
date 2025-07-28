import { supabase } from './supabase'
import { EmailService } from './email'

export interface EmailResendOptions {
  email: string
  type: 'verification' | 'password_reset' | 'welcome'
  name?: string
}

export interface EmailStatus {
  exists: boolean
  verified: boolean
  message: string
}

/**
 * Resend email verification to a user
 */
export const resendEmailVerification = async (email: string, name?: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to resend verification email')
    }

    return { success: true, message: result.message }
  } catch (error) {
    console.error('Resend verification error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to resend verification email' 
    }
  }
}

/**
 * Resend password reset email to a user
 */
export const resendPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch('/api/auth/resend-password-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to resend password reset email')
    }

    return { success: true, message: result.message }
  } catch (error) {
    console.error('Resend password reset error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to resend password reset email' 
    }
  }
}

/**
 * Check email verification status
 */
export const checkEmailVerification = async (email: string): Promise<EmailStatus> => {
  try {
    const response = await fetch('/api/auth/check-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to check verification status')
    }

    return result
  } catch (error) {
    console.error('Check verification error:', error)
    return {
      exists: false,
      verified: false,
      message: error instanceof Error ? error.message : 'Failed to check verification status'
    }
  }
}

/**
 * Send order notification email
 */
export const sendOrderNotification = async (
  email: string, 
  orderDetails: any, 
  type: 'new_order' | 'order_update' | 'order_completed'
): Promise<{ success: boolean; message: string }> => {
  try {
    const result = await EmailService.sendOrderNotification(email, orderDetails, type)
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to send order notification')
    }

    return { success: true, message: 'Order notification sent successfully' }
  } catch (error) {
    console.error('Order notification error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to send order notification' 
    }
  }
}

/**
 * Send message notification email
 */
export const sendMessageNotification = async (
  email: string, 
  senderName: string, 
  messagePreview: string, 
  conversationLink: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const result = await EmailService.sendMessageNotification(email, senderName, messagePreview, conversationLink)
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to send message notification')
    }

    return { success: true, message: 'Message notification sent successfully' }
  } catch (error) {
    console.error('Message notification error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to send message notification' 
    }
  }
}

/**
 * Send payment confirmation email
 */
export const sendPaymentConfirmation = async (
  email: string, 
  paymentDetails: any
): Promise<{ success: boolean; message: string }> => {
  try {
    const result = await EmailService.sendPaymentConfirmation(email, paymentDetails)
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to send payment confirmation')
    }

    return { success: true, message: 'Payment confirmation sent successfully' }
  } catch (error) {
    console.error('Payment confirmation error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to send payment confirmation' 
    }
  }
}

/**
 * Get user's email preferences
 */
export const getEmailPreferences = async (): Promise<{
  orderNotifications: boolean
  messageNotifications: boolean
  marketingEmails: boolean
}> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('email_preferences')
      .eq('id', user.id)
      .single()

    return profile?.email_preferences || {
      orderNotifications: true,
      messageNotifications: true,
      marketingEmails: false,
    }
  } catch (error) {
    console.error('Get email preferences error:', error)
    return {
      orderNotifications: true,
      messageNotifications: true,
      marketingEmails: false,
    }
  }
}

/**
 * Update user's email preferences
 */
export const updateEmailPreferences = async (preferences: {
  orderNotifications: boolean
  messageNotifications: boolean
  marketingEmails: boolean
}): Promise<{ success: boolean; message: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { error } = await supabase
      .from('profiles')
      .update({ email_preferences: preferences })
      .eq('id', user.id)

    if (error) {
      throw new Error('Failed to update email preferences')
    }

    return { success: true, message: 'Email preferences updated successfully' }
  } catch (error) {
    console.error('Update email preferences error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to update email preferences' 
    }
  }
} 