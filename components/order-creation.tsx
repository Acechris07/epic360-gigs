"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, DollarSign, User, AlertCircle, CreditCard } from 'lucide-react'
import { createOrder, CreateOrderData } from '@/lib/orders'
import { formatOrderAmount } from '@/lib/orders'
import { PaymentForm } from '@/components/payment-form'
import { calculatePlatformFee } from '@/lib/stripe'

interface OrderCreationProps {
  gigId?: string
  serviceId?: string
  freelancerId: string
  freelancerName: string
  title: string
  description: string
  price: number
  deliveryTime: number
  category: string
  images?: string[]
  onSuccess?: (orderId: string) => void
  onCancel?: () => void
}

export function OrderCreation({
  gigId,
  serviceId,
  freelancerId,
  freelancerName,
  title,
  description,
  price,
  deliveryTime,
  category,
  images = [],
  onSuccess,
  onCancel
}: OrderCreationProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requirements, setRequirements] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)

  // Calculate delivery date based on delivery time
  const calculateDeliveryDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + deliveryTime)
    return date.toISOString().split('T')[0]
  }

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const orderData: CreateOrderData = {
        gig_id: gigId,
        service_id: serviceId,
        freelancer_id: freelancerId,
        total_amount: price,
        requirements: requirements.trim() || undefined,
        delivery_date: deliveryDate || calculateDeliveryDate()
      }

      const order = await createOrder(orderData)
      setOrderId(order.id)
      setShowPayment(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create order')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaymentSuccess = () => {
    if (onSuccess && orderId) {
      onSuccess(orderId)
    } else if (orderId) {
      router.push(`/orders/${orderId}`)
    }
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
    setOrderId(null)
  }

  const platformFee = calculatePlatformFee(price)
  const totalAmount = price + platformFee

  if (showPayment && orderId) {
    return (
      <div className="max-w-2xl mx-auto">
        <PaymentForm
          orderId={orderId}
          amount={price}
          platformFee={platformFee}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Place Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Order Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">{title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Freelancer:</span>
                <span className="font-medium">{freelancerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{category}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Price:</span>
                <span className="font-semibold text-green-600">{formatOrderAmount(price)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Delivery:</span>
                <span className="font-medium">{deliveryTime} days</span>
              </div>
            </div>

            {/* Preview Image */}
            {images.length > 0 && (
              <div className="mt-4">
                <img
                  src={images[0]}
                  alt={title}
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            )}
          </div>

          {/* Order Form */}
          <form onSubmit={handleCreateOrder} className="space-y-4">
            <div>
              <Label htmlFor="requirements">Requirements (Optional)</Label>
              <Textarea
                id="requirements"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Describe your specific requirements, preferences, or any additional details..."
                rows={4}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Be specific about what you need to get the best results
              </p>
            </div>

            <div>
              <Label htmlFor="delivery_date">Expected Delivery Date</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <Input
                  id="delivery_date"
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Default: {new Date(Date.now() + deliveryTime * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>

            {/* Order Summary */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Order Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Service Price:</span>
                  <span>{formatOrderAmount(price)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee:</span>
                  <span>{formatOrderAmount(platformFee)}</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="text-green-600">{formatOrderAmount(totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Order...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Continue to Payment
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 