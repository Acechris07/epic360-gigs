"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageNotification } from '@/components/message-notification'
import { createMessage } from '@/lib/messaging'
import { useAuth } from '@/lib/auth'

export default function TestMessagesPage() {
  const { user } = useAuth()
  const [testResults, setTestResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testMessageCreation = async () => {
    if (!user) {
      setTestResults({ success: false, error: 'User not authenticated' })
      return
    }

    setLoading(true)
    try {
      // Create a test message to yourself (for testing purposes)
      const message = await createMessage({
        receiver_id: user.id,
        content: 'This is a test message from the messaging system!',
      })

      setTestResults({
        success: true,
        message: 'Test message created successfully',
        data: message
      })
    } catch (error) {
      setTestResults({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create test message'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messaging System Test</h1>
          <p className="text-gray-600">Test the real-time messaging functionality</p>
        </div>

        {/* Authentication Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-2">
                <p><strong>Status:</strong> <Badge variant="default">Authenticated</Badge></p>
                <p><strong>User ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{user.id}</code></p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p><strong>Status:</strong> <Badge variant="destructive">Not Authenticated</Badge></p>
                <p className="text-gray-600">Please sign in to test the messaging system.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Notification Test */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Message Notification Component</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <MessageNotification />
              <p className="text-sm text-gray-600">
                This component shows unread message count and links to the messages page.
                The badge will appear when there are unread messages.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Test Message Creation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Message Creation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Test the message creation API by sending a test message.
            </p>

            <Button
              onClick={testMessageCreation}
              disabled={!user || loading}
            >
              {loading ? 'Creating Test Message...' : 'Create Test Message'}
            </Button>

            {testResults && (
              <div className={`p-4 rounded-lg ${testResults.success ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">
                    {testResults.success ? 'Test Successful' : 'Test Failed'}
                  </span>
                </div>

                {testResults.message && (
                  <p className="text-sm mb-3">{testResults.message}</p>
                )}

                {testResults.error && (
                  <p className="text-sm text-red-600 mb-3">{testResults.error}</p>
                )}

                {testResults.data && (
                  <details className="text-sm">
                    <summary className="cursor-pointer font-semibold">View Message Data</summary>
                    <pre className="mt-2 overflow-auto bg-gray-100 p-2 rounded">
                      {JSON.stringify(testResults.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Links */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Test the Full Messaging System:</h4>
                <div className="space-y-2">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <a href="/messages">
                      📱 Go to Messages Page
                    </a>
                  </Button>
                  <p className="text-sm text-gray-600">
                    Visit the main messages page to test the complete chat interface.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Features to Test:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Real-time message delivery</li>
                  <li>Message read status</li>
                  <li>Conversation list</li>
                  <li>Order-specific conversations</li>
                  <li>Unread message notifications</li>
                  <li>Message formatting and timestamps</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> To test real-time messaging between users, you'll need to:
                  <br />
                  1. Create multiple user accounts
                  <br />
                  2. Send messages between different users
                  <br />
                  3. Open the messages page in different browser tabs/windows
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 