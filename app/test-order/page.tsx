"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { OrderCreation } from '@/components/order-creation'

export default function TestOrderPage() {
  const [showOrderForm, setShowOrderForm] = useState(false)

  // Sample gig data for testing
  const sampleGig = {
    id: 'test-gig-123',
    freelancerId: 'test-freelancer-456',
    freelancerName: 'John Doe',
    title: 'Professional Logo Design',
    description: 'I will create a modern, professional logo for your business. Includes 3 revisions and source files.',
    price: 150.00,
    deliveryTime: 3,
    category: 'Design',
    images: ['https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Logo+Design']
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order & Payment Test</h1>
          <p className="text-gray-600">Test the complete order creation and payment flow</p>
        </div>

        {/* Sample Gig Display */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Sample Gig for Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">{sampleGig.title}</h3>
                <p className="text-gray-600 mb-4">{sampleGig.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Freelancer:</span>
                    <span className="font-medium">{sampleGig.freelancerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Category:</span>
                    <Badge variant="secondary">{sampleGig.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-green-600">${sampleGig.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Delivery Time:</span>
                    <span className="font-medium">{sampleGig.deliveryTime} days</span>
                  </div>
                </div>
              </div>
              
              <div>
                <img
                  src={sampleGig.images[0]}
                  alt={sampleGig.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Creation Test */}
        <Card>
          <CardHeader>
            <CardTitle>Test Order Creation & Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Click the button below to test the complete order creation and payment flow.
            </p>
            
            <Button 
              onClick={() => setShowOrderForm(!showOrderForm)}
              size="lg"
            >
              {showOrderForm ? 'Hide Order Form' : 'Create Test Order'}
            </Button>

            {showOrderForm && (
              <div className="mt-6">
                <OrderCreation
                  gigId={sampleGig.id}
                  freelancerId={sampleGig.freelancerId}
                  freelancerName={sampleGig.freelancerName}
                  title={sampleGig.title}
                  description={sampleGig.description}
                  price={sampleGig.price}
                  deliveryTime={sampleGig.deliveryTime}
                  category={sampleGig.category}
                  images={sampleGig.images}
                  onSuccess={(orderId) => {
                    alert(`Order created successfully! Order ID: ${orderId}`)
                    setShowOrderForm(false)
                  }}
                  onCancel={() => setShowOrderForm(false)}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Test Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Steps to Test:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Click "Create Test Order" above</li>
                  <li>Fill in any requirements (optional)</li>
                  <li>Click "Continue to Payment"</li>
                  <li>Use test card: <code className="bg-gray-100 px-1 rounded">4242 4242 4242 4242</code></li>
                  <li>Complete the payment</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Test Card Numbers:</h4>
                <div className="space-y-1 text-sm">
                  <div><strong>Success:</strong> 4242 4242 4242 4242</div>
                  <div><strong>Decline:</strong> 4000 0000 0000 0002</div>
                  <div><strong>Authentication Required:</strong> 4000 0025 0000 3155</div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This is a test environment. No real charges will be made.
                  The order will be created in your database and the payment will be processed through Stripe's test mode.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 