import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createPaymentIntent, calculatePlatformFee } from '@/lib/stripe'
import { z } from 'zod'

const createPaymentIntentSchema = z.object({
  orderId: z.string().uuid(),
  amount: z.number().positive(),
})

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createPaymentIntentSchema.parse(body)

    // Verify the order exists and belongs to the user
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, client_id, status, total_amount')
      .eq('id', validatedData.orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.client_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (order.status !== 'pending') {
      return NextResponse.json({ error: 'Order is not in pending status' }, { status: 400 })
    }

    // Calculate total amount including platform fee
    const platformFee = calculatePlatformFee(validatedData.amount)
    const totalAmount = validatedData.amount + platformFee

    // Create payment intent
    const paymentIntent = await createPaymentIntent(totalAmount, validatedData.orderId)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalAmount,
      platformFee,
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }

    console.error('Payment intent creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 