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

    // Get all messages where user is sender or receiver
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, full_name, email, avatar_url),
        receiver:profiles!messages_receiver_id_fkey(id, full_name, email, avatar_url)
      `)
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (messagesError) {
      console.error('Messages fetch error:', messagesError)
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }

    // Group messages by conversation (other participant)
    const conversationsMap = new Map()

    messages.forEach((message) => {
      const isSender = message.sender_id === user.id
      const otherUserId = isSender ? message.receiver_id : message.sender_id
      const otherUser = isSender ? message.receiver : message.sender

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          id: otherUserId,
          participant_id: otherUserId,
          participant_name: otherUser?.full_name || 'Unknown User',
          participant_avatar: otherUser?.avatar_url,
          last_message: message.content,
          last_message_time: message.created_at,
          unread_count: 0,
          order_id: message.order_id,
        })
      }

      // Update unread count for messages sent to current user
      if (!isSender && !message.is_read) {
        const conversation = conversationsMap.get(otherUserId)
        conversation.unread_count += 1
      }
    })

    const conversations = Array.from(conversationsMap.values())
      .sort((a, b) => new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime())

    return NextResponse.json({ conversations })

  } catch (error) {
    console.error('Conversations fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 