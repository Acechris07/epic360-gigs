"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { resendEmailVerification, resendPasswordReset, checkEmailVerification } from '@/lib/email-utils'

export default function TestResendEmailPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testResendVerification = async () => {
    if (!email) return
    
    setIsLoading(true)
    setResult(null)

    try {
      const response = await resendEmailVerification(email)
      setResult({
        type: 'verification',
        success: response.success,
        message: response.message
      })
    } catch (error) {
      setResult({
        type: 'verification',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testResendPasswordReset = async () => {
    if (!email) return
    
    setIsLoading(true)
    setResult(null)

    try {
      const response = await resendPasswordReset(email)
      setResult({
        type: 'password-reset',
        success: response.success,
        message: response.message
      })
    } catch (error) {
      setResult({
        type: 'password-reset',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testCheckVerification = async () => {
    if (!email) return
    
    setIsLoading(true)
    setResult(null)

    try {
      const response = await checkEmailVerification(email)
      setResult({
        type: 'check-verification',
        success: true,
        data: response
      })
    } catch (error) {
      setResult({
        type: 'check-verification',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Resend Email Functionality</h1>
          <p className="text-gray-600">Test the email resend functionality</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Testing
            </CardTitle>
            <CardDescription>
              Enter an email address to test the resend functionality
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
                placeholder="Enter email to test"
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={testCheckVerification}
                disabled={isLoading || !email}
                variant="outline"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Check Verification Status'
                )}
              </Button>

              <Button
                onClick={testResendVerification}
                disabled={isLoading || !email}
                variant="outline"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend Verification'
                )}
              </Button>

              <Button
                onClick={testResendPasswordReset}
                disabled={isLoading || !email}
                variant="outline"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend Password Reset'
                )}
              </Button>
            </div>

            {result && (
              <Alert variant={result.success ? "default" : "destructive"}>
                {result.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  <div className="font-medium mb-1">
                    {result.type === 'verification' && 'Resend Verification Result:'}
                    {result.type === 'password-reset' && 'Resend Password Reset Result:'}
                    {result.type === 'check-verification' && 'Check Verification Result:'}
                  </div>
                  {result.message && <p>{result.message}</p>}
                  {result.data && (
                    <pre className="text-xs mt-2 bg-gray-100 p-2 rounded">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Test Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. Enter a valid email address</p>
            <p>2. Click "Check Verification Status" to see if the account exists and is verified</p>
            <p>3. Click "Resend Verification" to resend email verification</p>
            <p>4. Click "Resend Password Reset" to resend password reset email</p>
            <p>5. Check the results below</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 