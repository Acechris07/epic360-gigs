"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Loader2, CreditCard } from 'lucide-react'
import { PaymentForm } from '@/components/payment-form'

export default function TestPaymentPage() {
  const [testResults, setTestResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const testStripeConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-stripe')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: 'Failed to test Stripe connection' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stripe Payment Test</h1>
          <p className="text-gray-600">Test your Stripe integration and payment flow</p>
        </div>

        {/* Stripe Connection Test */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Test Stripe Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Test if your Stripe API keys are configured correctly.
            </p>
            
            <Button 
              onClick={testStripeConnection}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Testing...
                </>
              ) : (
                'Test Stripe Connection'
              )}
            </Button>

            {testResults && (
              <div className={`p-4 rounded-lg ${testResults.success ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {testResults.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="font-semibold">
                    {testResults.success ? 'Stripe Connected Successfully' : 'Stripe Connection Failed'}
                  </span>
                </div>
                
                {testResults.message && (
                  <p className="text-sm mb-3">{testResults.message}</p>
                )}

                {testResults.environment && (
                  <div className="mb-3">
                    <h4 className="font-semibold mb-2">Environment Variables:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span>Publishable Key:</span>
                        <Badge variant={testResults.environment.publishableKey === 'Set' ? 'default' : 'destructive'}>
                          {testResults.environment.publishableKey}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Secret Key:</span>
                        <Badge variant={testResults.environment.secretKey === 'Set' ? 'default' : 'destructive'}>
                          {testResults.environment.secretKey}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Webhook Secret:</span>
                        <Badge variant={testResults.environment.webhookSecret === 'Set' ? 'default' : 'destructive'}>
                          {testResults.environment.webhookSecret}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                {testResults.error && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{testResults.error}</AlertDescription>
                  </Alert>
                )}

                {testResults.testPaymentIntent && (
                  <details className="text-sm">
                    <summary className="cursor-pointer font-semibold">View Test Payment Intent</summary>
                    <pre className="mt-2 overflow-auto bg-gray-100 p-2 rounded">
                      {JSON.stringify(testResults.testPaymentIntent, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Form Test */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Test Payment Form
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Test the complete payment flow with a sample order.
            </p>
            
            <Button 
              onClick={() => setShowPayment(!showPayment)}
              variant="outline"
            >
              {showPayment ? 'Hide Payment Form' : 'Show Payment Form'}
            </Button>

            {showPayment && (
              <div className="mt-4">
                <PaymentForm
                  orderId="test-order-123"
                  amount={50.00}
                  platformFee={2.50}
                  onSuccess={() => {
                    alert('Payment successful!')
                    setShowPayment(false)
                  }}
                  onCancel={() => setShowPayment(false)}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Test Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Test Card Numbers:</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Successful Payment:</strong> 4242 4242 4242 4242
                  </div>
                  <div>
                    <strong>Declined Payment:</strong> 4000 0000 0000 0002
                  </div>
                  <div>
                    <strong>Requires Authentication:</strong> 4000 0025 0000 3155
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Test Details:</h4>
                <div className="space-y-1 text-sm">
                  <div><strong>Expiry Date:</strong> Any future date (e.g., 12/25)</div>
                  <div><strong>CVC:</strong> Any 3 digits (e.g., 123)</div>
                  <div><strong>ZIP Code:</strong> Any valid ZIP code</div>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Note:</strong> This is a test environment. No real charges will be made.
                  Make sure you're using test API keys from your Stripe Dashboard.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 