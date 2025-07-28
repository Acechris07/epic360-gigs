import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent, supabase)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent, supabase)
        break

      case 'charge.refunded':
        await handleRefundProcessed(event.data.object as Stripe.Charge, supabase)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent, supabase: any) {
  const orderId = paymentIntent.metadata.orderId

  if (!orderId) {
    console.error('No orderId in payment intent metadata')
    return
  }

  // Update order status to in_progress
  const { error } = await supabase
    .from('orders')
    .update({ 
      status: 'in_progress',
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)

  if (error) {
    console.error('Error updating order status:', error)
    throw error
  }

  console.log(`Order ${orderId} payment succeeded and status updated to in_progress`)
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent, supabase: any) {
  const orderId = paymentIntent.metadata.orderId

  if (!orderId) {
    console.error('No orderId in payment intent metadata')
    return
  }

  // Update order status to cancelled
  const { error } = await supabase
    .from('orders')
    .update({ 
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)

  if (error) {
    console.error('Error updating order status:', error)
    throw error
  }

  console.log(`Order ${orderId} payment failed and status updated to cancelled`)
}

async function handleRefundProcessed(charge: Stripe.Charge, supabase: any) {
  // Handle refund processing if needed
  console.log(`Refund processed for charge ${charge.id}`)
} 