"use client"

import { useState, useEffect } from 'react'
import { getUnreadCount, subscribeToMessages } from '@/lib/messaging'
import { Badge } from '@/components/ui/badge'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'

export function MessageNotification() {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const count = await getUnreadCount()
        setUnreadCount(count)
      } catch (error) {
        console.error('Failed to load unread count:', error)
      }
    }

    loadUnreadCount()

    // Subscribe to real-time updates
    const subscription = subscribeToMessages('current-user', (newMessage) => {
      setUnreadCount(prev => prev + 1)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <Link href="/messages" className="relative">
      <MessageCircle className="h-5 w-5 text-gray-600 hover:text-green-600 transition-colors" />
      {unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </Link>
  )
} 