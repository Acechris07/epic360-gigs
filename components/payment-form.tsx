"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CreditCard, CheckCircle, XCircle } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  orderId: string
  amount: number
  platformFee: number
  onSuccess?: () => void
  onCancel?: () => void
}

function PaymentFormContent({ orderId, amount, platformFee, onSuccess, onCancel }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const totalAmount = amount + platformFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message || 'Payment failed')
        setIsProcessing(false)
        return
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders/${orderId}?payment=success`,
        },
      })

      if (confirmError) {
        setError(confirmError.message || 'Payment failed')
      } else {
        setSuccess(true)
        if (onSuccess) {
          onSuccess()
        }
        // Redirect to order page after a short delay
        setTimeout(() => {
          router.push(`/orders/${orderId}`)
        }, 2000)
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">
              Your payment has been processed successfully. Redirecting to order details...
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Complete Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-3">Payment Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Order Amount:</span>
                <span>${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee (5%):</span>
                <span>${platformFee.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total:</span>
                <span className="text-green-600">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Element */}
          <div className="space-y-4">
            <label className="text-sm font-medium">Payment Information</label>
            <PaymentElement />
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!stripe || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                `Pay $${totalAmount.toFixed(2)}`
              )}
            </Button>
          </div>

          {/* Security Notice */}
          <div className="text-xs text-gray-500 text-center">
            🔒 Your payment information is secure and encrypted
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export function PaymentForm(props: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/payments/create-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: props.orderId,
            amount: props.amount,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to create payment intent')
        }

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to initialize payment')
      } finally {
        setLoading(false)
      }
    }

    createPaymentIntent()
  }, [props.orderId, props.amount])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Initializing payment...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!clientSecret) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>Failed to initialize payment</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentFormContent {...props} />
    </Elements>
  )
} 