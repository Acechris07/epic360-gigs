import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const senderId = searchParams.get('senderId')
    const orderId = searchParams.get('orderId')

    if (!senderId) {
      return NextResponse.json({ error: 'senderId is required' }, { status: 400 })
    }

    // Build query to mark messages as read
    let query = supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', senderId)
      .eq('receiver_id', user.id)
      .eq('is_read', false)

    // If orderId is provided, filter by order
    if (orderId) {
      query = query.eq('order_id', orderId)
    } else {
      query = query.is('order_id', null)
    }

    const { error } = await query

    if (error) {
      console.error('Mark as read error:', error)
      return NextResponse.json({ error: 'Failed to mark messages as read' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Messages marked as read' })

  } catch (error) {
    console.error('Mark as read error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 