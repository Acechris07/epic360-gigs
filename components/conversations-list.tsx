"use client"

import { useState, useEffect } from 'react'
import { Conversation, getConversations, formatMessageTime } from '@/lib/messaging'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Loader2, MessageCircle } from 'lucide-react'

interface ConversationsListProps {
  onSelectConversation: (conversation: Conversation) => void
  selectedConversationId?: string
}

export function ConversationsList({ onSelectConversation, selectedConversationId }: ConversationsListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true)
        const fetchedConversations = await getConversations()
        setConversations(fetchedConversations)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load conversations')
      } finally {
        setLoading(false)
      }
    }

    loadConversations()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <MessageCircle className="h-12 w-12 mb-4" />
        <p>No conversations yet</p>
        <p className="text-sm">Start messaging with other users!</p>
      </div>
    )
  }

  return (
    <div className="divide-y">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => onSelectConversation(conversation)}
          className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
            selectedConversationId === conversation.id ? 'bg-gray-50' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage 
                src={conversation.participant_avatar} 
                alt={conversation.participant_name} 
              />
              <AvatarFallback>
                {conversation.participant_name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium truncate">{conversation.participant_name}</h3>
                <div className="flex items-center gap-2">
                  {conversation.unread_count > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {conversation.unread_count}
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">
                    {conversation.last_message_time && formatMessageTime(conversation.last_message_time)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-600 truncate flex-1">
                  {conversation.last_message}
                </p>
                {conversation.order_id && (
                  <Badge variant="secondary" className="text-xs">
                    Order
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
} 