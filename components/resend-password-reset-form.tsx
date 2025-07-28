"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import { resendPasswordReset, checkEmailVerification } from '@/lib/email-utils'
import { validateEmail } from '@/lib/auth-security'

interface ResendPasswordResetFormProps {
  email?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function ResendPasswordResetForm({ email: initialEmail = '', onSuccess, onCancel }: ResendPasswordResetFormProps) {
  const [email, setEmail] = useState(initialEmail)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [emailStatus, setEmailStatus] = useState<{
    exists: boolean
    verified: boolean
    message: string
  } | null>(null)

  const handleCheckEmail = async () => {
    if (!email || !validateEmail(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setIsChecking(true)
    setStatus('idle')
    setMessage('')

    try {
      const result = await checkEmailVerification(email)
      setEmailStatus(result)

      if (!result.exists) {
        setStatus('error')
        setMessage('No account found with this email address')
      } else {
        setStatus('idle')
        setMessage('Account found. You can resend the password reset email.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Failed to check email status. Please try again.')
    } finally {
      setIsChecking(false)
    }
  }

  const handleResend = async () => {
    if (!email || !validateEmail(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    setStatus('idle')
    setMessage('')

    try {
      const result = await resendPasswordReset(email)
      
      if (result.success) {
        setStatus('success')
        setMessage(result.message)
        onSuccess?.()
      } else {
        setStatus('error')
        setMessage(result.message)
      }
    } catch (error) {
      setStatus('error')
      setMessage('Failed to resend password reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Resend Password Reset
        </CardTitle>
        <CardDescription>
          Enter your email address to resend the password reset email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            disabled={isLoading || isChecking}
          />
        </div>

        {emailStatus && (
          <Alert variant="default">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              {emailStatus.message}
            </AlertDescription>
          </Alert>
        )}

        {status === 'success' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>
        )}

        {status === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleCheckEmail}
            disabled={isLoading || isChecking || !email}
            variant="outline"
            className="flex-1"
          >
            {isChecking ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              'Check Email'
            )}
          </Button>
          
          <Button
            onClick={handleResend}
            disabled={isLoading || isChecking || !email}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              'Resend Email'
            )}
          </Button>
        </div>

        {onCancel && (
          <Button
            onClick={onCancel}
            variant="ghost"
            className="w-full"
            disabled={isLoading || isChecking}
          >
            Cancel
          </Button>
        )}

        <div className="text-xs text-gray-500 text-center">
          <p>• The password reset link will expire in 1 hour</p>
          <p>• Check your spam folder if you don't see the email</p>
        </div>
      </CardContent>
    </Card>
  )
} 