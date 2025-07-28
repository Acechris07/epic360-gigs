"use client"

import { useState } from 'react'
import { ResendEmailForm } from '@/components/resend-email-form'
import { ResendPasswordResetForm } from '@/components/resend-password-reset-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mail, Lock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ResendEmailPage() {
  const [activeTab, setActiveTab] = useState('verification')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Link href="/auth/signin" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resend Email</h1>
          <p className="text-gray-600">Resend verification or password reset emails</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="verification" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Verification
            </TabsTrigger>
            <TabsTrigger value="password-reset" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Password Reset
            </TabsTrigger>
          </TabsList>

          <TabsContent value="verification" className="mt-6">
            <ResendEmailForm />
          </TabsContent>

          <TabsContent value="password-reset" className="mt-6">
            <ResendPasswordResetForm />
          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
            <CardDescription>
              If you're still having trouble, here are some things to check:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>• Check your spam or junk folder</p>
            <p>• Make sure you're using the correct email address</p>
            <p>• Wait a few minutes before requesting another email</p>
            <p>• Contact support if the problem persists</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 