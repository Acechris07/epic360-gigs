"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2 } from 'lucide-react'
import { createMessage, CreateMessageData } from '@/lib/messaging'

interface ChatInputProps {
  receiverId: string
  orderId?: string
  onMessageSent?: () => void
  disabled?: boolean
}

export function ChatInput({ receiverId, orderId, onMessageSent, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim() || isSending || disabled) {
      return
    }

    setIsSending(true)

    try {
      const messageData: CreateMessageData = {
        receiver_id: receiverId,
        content: message.trim(),
        order_id: orderId,
      }

      await createMessage(messageData)
      setMessage('')
      onMessageSent?.()
    } catch (error) {
      console.error('Failed to send message:', error)
      // You could add a toast notification here
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  return (
    <form onSubmit={handleSubmit} className="border-t bg-white p-4">
      <div className="flex gap-2">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="min-h-[40px] max-h-[120px] resize-none"
          disabled={disabled || isSending}
          rows={1}
        />
        <Button
          type="submit"
          size="sm"
          disabled={!message.trim() || isSending || disabled}
          className="px-3"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  )
} 