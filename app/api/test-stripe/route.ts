import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function GET() {
  try {
    // Test Stripe connection by creating a test payment intent
    const testPaymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // $10.00
      currency: 'usd',
      metadata: {
        test: 'true'
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Stripe is configured correctly',
      testPaymentIntent: {
        id: testPaymentIntent.id,
        amount: testPaymentIntent.amount,
        currency: testPaymentIntent.currency,
        status: testPaymentIntent.status,
        client_secret: testPaymentIntent.client_secret
      },
      environment: {
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Not set',
        secretKey: process.env.STRIPE_SECRET_KEY ? 'Set' : 'Not set',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? 'Set' : 'Not set'
      }
    })

  } catch (error) {
    console.error('Stripe test error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Not set',
        secretKey: process.env.STRIPE_SECRET_KEY ? 'Set' : 'Not set',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? 'Set' : 'Not set'
      }
    }, { status: 500 })
  }
} 