import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const otherUserId = searchParams.get('otherUserId')
    const orderId = searchParams.get('orderId')

    if (!otherUserId) {
      return NextResponse.json({ error: 'otherUserId is required' }, { status: 400 })
    }

    // Verify other user exists
    const { data: otherUser, error: otherUserError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', otherUserId)
      .single()

    if (otherUserError || !otherUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Build query for messages between the two users
    let query = supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(full_name, email, avatar_url),
        receiver:profiles!messages_receiver_id_fkey(full_name, email, avatar_url)
      `)
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)

    // If orderId is provided, filter by order
    if (orderId) {
      query = query.eq('order_id', orderId)
    } else {
      query = query.is('order_id', null)
    }

    // Order by created_at ascending
    query = query.order('created_at', { ascending: true })

    const { data: messages, error } = await query

    if (error) {
      console.error('Messages fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }

    return NextResponse.json({ messages })

  } catch (error) {
    console.error('Messages fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 