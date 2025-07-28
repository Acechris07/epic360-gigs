import Stripe from 'stripe'

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

// Create a payment intent for an order
export const createPaymentIntent = async (amount: number, orderId: string) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return paymentIntent
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw new Error('Failed to create payment intent')
  }
}

// Create a customer
export const createCustomer = async (email: string, name?: string) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    })

    return customer
  } catch (error) {
    console.error('Error creating customer:', error)
    throw new Error('Failed to create customer')
  }
}

// Get payment intent by ID
export const getPaymentIntent = async (paymentIntentId: string) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return paymentIntent
  } catch (error) {
    console.error('Error retrieving payment intent:', error)
    throw new Error('Failed to retrieve payment intent')
  }
}

// Create a refund
export const createRefund = async (paymentIntentId: string, amount?: number) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    })

    return refund
  } catch (error) {
    console.error('Error creating refund:', error)
    throw new Error('Failed to create refund')
  }
}

// Calculate platform fee (5%)
export const calculatePlatformFee = (amount: number): number => {
  return amount * 0.05
}

// Calculate freelancer payout (95%)
export const calculateFreelancerPayout = (amount: number): number => {
  return amount * 0.95
}

// Format amount for display
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

// Format amount for Stripe (in cents)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100)
} 