"use client"

import { useState, useEffect, useRef } from 'react'
import { Message, getMessages, markMessagesAsRead, subscribeToConversation } from '@/lib/messaging'
import { ChatMessage } from '@/components/chat-message'
import { ChatInput } from '@/components/chat-input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Loader2, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/lib/auth'

interface ChatWindowProps {
  otherUserId: string
  otherUserName: string
  otherUserAvatar?: string
  orderId?: string
  onBack?: () => void
}

export function ChatWindow({ 
  otherUserId, 
  otherUserName, 
  otherUserAvatar, 
  orderId, 
  onBack 
}: ChatWindowProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true)
        const fetchedMessages = await getMessages(otherUserId, orderId)
        setMessages(fetchedMessages)
        
        // Mark messages as read
        if (fetchedMessages.length > 0) {
          await markMessagesAsRead(otherUserId, orderId)
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load messages')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadMessages()
    }
  }, [otherUserId, orderId, user])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return

    const subscription = subscribeToConversation(
      user.id,
      otherUserId,
      orderId,
      (newMessage) => {
        setMessages(prev => {
          // Check if message already exists
          if (prev.find(m => m.id === newMessage.id)) {
            return prev
          }
          return [...prev, newMessage]
        })

        // Mark as read if we're the receiver
        if (newMessage.receiver_id === user.id) {
          markMessagesAsRead(otherUserId, orderId)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [user, otherUserId, orderId])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleMessageSent = () => {
    // Messages will be added via real-time subscription
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b bg-white p-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded">
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <Avatar className="w-8 h-8">
              <AvatarImage src={otherUserAvatar} alt={otherUserName} />
              <AvatarFallback>{otherUserName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{otherUserName}</h3>
              {orderId && (
                <Badge variant="secondary" className="text-xs">
                  Order #{orderId.slice(0, 8)}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b bg-white p-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded">
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <Avatar className="w-8 h-8">
              <AvatarImage src={otherUserAvatar} alt={otherUserName} />
              <AvatarFallback>{otherUserName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{otherUserName}</h3>
              {orderId && (
                <Badge variant="secondary" className="text-xs">
                  Order #{orderId.slice(0, 8)}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-white p-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded">
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <Avatar className="w-8 h-8">
            <AvatarImage src={otherUserAvatar} alt={otherUserName} />
            <AvatarFallback>{otherUserName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{otherUserName}</h3>
            {orderId && (
              <Badge variant="secondary" className="text-xs">
                Order #{orderId.slice(0, 8)}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        receiverId={otherUserId}
        orderId={orderId}
        onMessageSent={handleMessageSent}
      />
    </div>
  )
} 