"use client"

import { useState, useEffect } from 'react'
import { Conversation } from '@/lib/messaging'
import { ConversationsList } from '@/components/conversations-list'
import { ChatWindow } from '@/components/chat-window'
import { useAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default function MessagesPage() {
  const { user, loading } = useAuth()
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      redirect('/auth/signin')
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Chat with clients and freelancers</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border h-[600px] flex">
          {/* Conversations List */}
          <div className="w-1/3 border-r">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Conversations</h2>
            </div>
            <div className="h-[calc(600px-80px)] overflow-y-auto">
              <ConversationsList
                onSelectConversation={setSelectedConversation}
                selectedConversationId={selectedConversation?.id}
              />
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1">
            {selectedConversation ? (
              <ChatWindow
                otherUserId={selectedConversation.participant_id}
                otherUserName={selectedConversation.participant_name}
                otherUserAvatar={selectedConversation.participant_avatar}
                orderId={selectedConversation.order_id}
                onBack={() => setSelectedConversation(null)}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p className="text-sm">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 