import { supabase } from './supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface Message {
  id: string
  order_id?: string
  sender_id: string
  receiver_id: string
  content: string
  is_read: boolean
  created_at: string
  sender?: {
    full_name: string
    email: string
    avatar_url?: string
  }
  receiver?: {
    full_name: string
    email: string
    avatar_url?: string
  }
}

export interface CreateMessageData {
  order_id?: string
  receiver_id: string
  content: string
}

export interface Conversation {
  id: string
  participant_id: string
  participant_name: string
  participant_avatar?: string
  last_message?: string
  last_message_time?: string
  unread_count: number
  order_id?: string
}

// Create a new message
export const createMessage = async (messageData: CreateMessageData): Promise<Message> => {
  const response = await fetch('/api/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create message')
  }

  const result = await response.json()
  return result.message
}

// Get messages for a conversation
export const getMessages = async (otherUserId: string, orderId?: string): Promise<Message[]> => {
  const searchParams = new URLSearchParams()
  searchParams.append('otherUserId', otherUserId)
  if (orderId) searchParams.append('orderId', orderId)

  const response = await fetch(`/api/messages/conversation?${searchParams.toString()}`)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch messages')
  }

  const result = await response.json()
  return result.messages
}

// Get conversations list
export const getConversations = async (): Promise<Conversation[]> => {
  const response = await fetch('/api/messages/conversations')
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch conversations')
  }

  const result = await response.json()
  return result.conversations
}

// Mark messages as read
export const markMessagesAsRead = async (senderId: string, orderId?: string): Promise<void> => {
  const searchParams = new URLSearchParams()
  searchParams.append('senderId', senderId)
  if (orderId) searchParams.append('orderId', orderId)

  const response = await fetch(`/api/messages/read?${searchParams.toString()}`, {
    method: 'PATCH',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to mark messages as read')
  }
}

// Subscribe to real-time messages
export const subscribeToMessages = (
  userId: string,
  callback: (message: Message) => void
): RealtimeChannel => {
  return supabase
    .channel(`messages:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new as Message)
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new as Message)
      }
    )
    .subscribe()
}

// Subscribe to conversation updates
export const subscribeToConversation = (
  userId: string,
  otherUserId: string,
  orderId: string | undefined,
  callback: (message: Message) => void
): RealtimeChannel => {
  const filter = orderId 
    ? `and(order_id.eq.${orderId},or(sender_id.eq.${userId},receiver_id.eq.${userId}))`
    : `and(order_id.is.null,or(sender_id.eq.${userId},receiver_id.eq.${userId}))`

  return supabase
    .channel(`conversation:${userId}:${otherUserId}:${orderId || 'general'}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter,
      },
      (payload) => {
        callback(payload.new as Message)
      }
    )
    .subscribe()
}

// Format message time
export const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (diffInHours < 48) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString()
  }
}

// Get unread message count
export const getUnreadCount = async (): Promise<number> => {
  const response = await fetch('/api/messages/unread-count')
  
  if (!response.ok) {
    return 0
  }

  const result = await response.json()
  return result.count
} 