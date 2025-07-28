"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OrderCreation } from '@/components/order-creation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CreateOrderPage() {
  const router = useRouter()
  const [showOrderForm, setShowOrderForm] = useState(false)

  // Sample gig data - in a real app, this would come from the database
  const sampleGig = {
    id: "sample-gig-123",
    freelancerId: "sample-freelancer-456",
    freelancerName: "John Developer",
    title: "Professional Web Development",
    description: "Custom websites and web applications built with modern technologies like React, Node.js, and TypeScript. I specialize in creating responsive, user-friendly applications that drive business growth.",
    price: 500,
    deliveryTime: 7,
    category: "IT & Technology",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=300&fit=crop"
    ]
  }

  const handleOrderSuccess = (orderId: string) => {
    alert(`Order created successfully! Order ID: ${orderId}`)
    router.push(`/orders/${orderId}`)
  }

  const handleCancel = () => {
    setShowOrderForm(false)
  }

  if (showOrderForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setShowOrderForm(false)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gig Details
          </Button>
        </div>
        
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
          onSuccess={handleOrderSuccess}
          onCancel={handleCancel}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Demo: Order Creation</h1>
        <p className="text-gray-600">This page demonstrates the order creation system with sample data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gig Details */}
        <Card>
          <CardHeader>
            <CardTitle>Gig Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-xl mb-2">{sampleGig.title}</h3>
              <p className="text-gray-600">{sampleGig.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Freelancer:</span>
                <p className="font-medium">{sampleGig.freelancerName}</p>
              </div>
              <div>
                <span className="text-gray-600">Category:</span>
                <p className="font-medium">{sampleGig.category}</p>
              </div>
              <div>
                <span className="text-gray-600">Price:</span>
                <p className="font-semibold text-green-600">${sampleGig.price}</p>
              </div>
              <div>
                <span className="text-gray-600">Delivery Time:</span>
                <p className="font-medium">{sampleGig.deliveryTime} days</p>
              </div>
            </div>

            {sampleGig.images.length > 0 && (
              <div>
                <img
                  src={sampleGig.images[0]}
                  alt={sampleGig.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Creation Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Order Creation Demo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              This demonstrates how the order creation system works. Click the button below to see the order form.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={() => setShowOrderForm(true)}
                className="w-full"
              >
                Create Order for This Gig
              </Button>
              
              <div className="text-sm text-gray-500 space-y-2">
                <p><strong>Features demonstrated:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Order form with requirements input</li>
                  <li>Delivery date selection</li>
                  <li>Price calculation with platform fees</li>
                  <li>Order validation and submission</li>
                  <li>Success/error handling</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Order Management System Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Order Creation</h4>
              <p className="text-sm text-gray-600">
                Users can create orders for gigs and services with custom requirements and delivery dates.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold mb-2">Status Tracking</h4>
              <p className="text-sm text-gray-600">
                Real-time order status updates: pending, in progress, completed, cancelled, disputed.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold mb-2">Role-based Permissions</h4>
              <p className="text-sm text-gray-600">
                Different actions available for clients vs freelancers based on order status.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold mb-2">Order Management</h4>
              <p className="text-sm text-gray-600">
                View all orders with filtering by status and role (client/freelancer).
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold mb-2">Dispute Resolution</h4>
              <p className="text-sm text-gray-600">
                Built-in dispute system for handling order conflicts between parties.
              </p>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-semibold mb-2">API Integration</h4>
              <p className="text-sm text-gray-600">
                RESTful API endpoints for creating, updating, and managing orders.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 