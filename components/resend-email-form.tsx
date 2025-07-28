"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { resendEmailVerification, checkEmailVerification } from '@/lib/email-utils'
import { validateEmail } from '@/lib/auth-security'

interface ResendEmailFormProps {
  email?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function ResendEmailForm({ email: initialEmail = '', onSuccess, onCancel }: ResendEmailFormProps) {
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
      } else if (result.verified) {
        setStatus('error')
        setMessage('This email is already verified. You can sign in with your account.')
      } else {
        setStatus('idle')
        setMessage('Email found and not verified. You can resend the verification email.')
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
      const result = await resendEmailVerification(email)
      
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
      setMessage('Failed to resend verification email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Resend Verification Email
        </CardTitle>
        <CardDescription>
          Enter your email address to resend the verification email
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
          <Alert variant={emailStatus.verified ? "default" : "destructive"}>
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
            disabled={isLoading || isChecking || !email || (emailStatus?.verified ?? false)}
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
      </CardContent>
    </Card>
  )
} 