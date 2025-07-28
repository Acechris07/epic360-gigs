import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { z } from 'zod'

const createMessageSchema = z.object({
  order_id: z.string().uuid().optional(),
  receiver_id: z.string().uuid(),
  content: z.string().min(1).max(1000),
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
    const validatedData = createMessageSchema.parse(body)

    // Verify receiver exists
    const { data: receiver, error: receiverError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', validatedData.receiver_id)
      .single()

    if (receiverError || !receiver) {
      return NextResponse.json({ error: 'Receiver not found' }, { status: 404 })
    }

    // If order_id is provided, verify the order exists and user has access
    if (validatedData.order_id) {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('client_id, freelancer_id')
        .eq('id', validatedData.order_id)
        .single()

      if (orderError || !order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      // Check if user is part of this order
      if (order.client_id !== user.id && order.freelancer_id !== user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }

      // Check if receiver is the other party in the order
      if (order.client_id !== validatedData.receiver_id && order.freelancer_id !== validatedData.receiver_id) {
        return NextResponse.json({ error: 'Receiver is not part of this order' }, { status: 400 })
      }
    }

    // Create message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        order_id: validatedData.order_id,
        sender_id: user.id,
        receiver_id: validatedData.receiver_id,
        content: validatedData.content,
        is_read: false,
      })
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(full_name, email, avatar_url),
        receiver:profiles!messages_receiver_id_fkey(full_name, email, avatar_url)
      `)
      .single()

    if (messageError) {
      console.error('Message creation error:', messageError)
      return NextResponse.json({ error: 'Failed to create message' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Message sent successfully',
      data: message
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }

    console.error('Message creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 