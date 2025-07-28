"use client"

import { Message, formatMessageTime } from '@/lib/messaging'
import { useAuth } from '@/lib/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { user } = useAuth()
  const isOwnMessage = message.sender_id === user?.id

  return (
    <div className={cn(
      "flex gap-3 mb-4",
      isOwnMessage ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage 
          src={message.sender?.avatar_url} 
          alt={message.sender?.full_name || 'User'} 
        />
        <AvatarFallback>
          {message.sender?.full_name?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>

      <div className={cn(
        "flex flex-col max-w-[70%]",
        isOwnMessage ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-4 py-2 rounded-lg text-sm",
          isOwnMessage 
            ? "bg-green-600 text-white rounded-br-md" 
            : "bg-gray-100 text-gray-900 rounded-bl-md"
        )}>
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        
        <div className={cn(
          "text-xs text-gray-500 mt-1",
          isOwnMessage ? "text-right" : "text-left"
        )}>
          {formatMessageTime(message.created_at)}
          {message.is_read && isOwnMessage && (
            <span className="ml-1">✓</span>
          )}
        </div>
      </div>
    </div>
  )
} 