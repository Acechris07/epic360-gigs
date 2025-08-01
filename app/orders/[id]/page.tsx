'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  DollarSign,
  User,
  Calendar,
  Eye,
  MessageSquare,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { ReviewSystem } from '@/components/review-system';
import { StarRating } from '@/components/star-rating';
import { OrderTracking } from '@/components/order-tracking';

interface Order {
  id: string;
  gig_id: string;
  client_id: string;
  freelancer_id: string;
  status: string;
  total_amount: number;
  requirements: string;
  delivery_date: string;
  created_at: string;
  updated_at: string;
  gig: {
    title: string;
    description: string;
    category: string;
    price: number;
    delivery_time: number;
    images: string[];
  };
  client: {
    id: string;
    full_name: string;
    avatar_url: string;
    rating: number;
    total_reviews: number;
  };
  freelancer: {
    id: string;
    full_name: string;
    avatar_url: string;
    rating: number;
    total_reviews: number;
  };
}

export default function OrderDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && params.id) {
      loadOrder();
    }
  }, [user, params.id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setOrder(data.order);
      } else {
        setError(data.error || 'Failed to load order');
      }
    } catch (error) {
      setError('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className="h-4 w-4" />,
        };
      case 'in_progress':
        return {
          label: 'In Progress',
          color: 'bg-blue-100 text-blue-800',
          icon: <Clock className="h-4 w-4" />,
        };
      case 'completed':
        return {
          label: 'Completed',
          color: 'bg-green-100 text-green-800',
          icon: <Star className="h-4 w-4" />,
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          color: 'bg-red-100 text-red-800',
          icon: <Clock className="h-4 w-4" />,
        };
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-800',
          icon: <Clock className="h-4 w-4" />,
        };
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please sign in to view order details
          </h1>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const isClient = user.id === order.client_id;
  const otherParty = isClient ? order.freelancer : order.client;
  const canReview = order.status === 'completed' && user.id === order.client_id;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Details
            </h1>
            <p className="text-gray-600">Order #{order.id.slice(0, 8)}</p>
          </div>
          <Link href="/orders">
            <Button variant="outline">Back to Orders</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {statusInfo.icon}
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
            </CardContent>
          </Card>

          {/* Gig Details */}
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">{order.gig.title}</h3>
              <p className="text-gray-600 mb-4">{order.gig.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold text-green-600">
                    {formatAmount(order.gig.price)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Delivery:</span>
                  <span className="font-medium">
                    {order.gig.delivery_time} days
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          {order.requirements && (
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{order.requirements}</p>
              </CardContent>
            </Card>
          )}

          {/* Order Tracking */}
          <OrderTracking
            orderId={order.id}
            currentStatus={order.status}
            isClient={isClient}
            isFreelancer={!isClient}
            onStatusUpdate={loadOrder}
          />

          {/* Review Section */}
          {order.status === 'completed' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewSystem
                  orderId={order.id}
                  canReview={canReview}
                  onReviewSubmitted={loadOrder}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-green-600">
                  {formatAmount(order.total_amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
              {order.delivery_date && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Date:</span>
                  <span className="font-medium">
                    {new Date(order.delivery_date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Other Party Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {isClient ? 'Freelancer' : 'Client'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-3">
                {otherParty.avatar_url ? (
                  <img
                    src={otherParty.avatar_url}
                    alt={otherParty.full_name}
                    className="h-12 w-12 rounded-full"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                )}
                <div>
                  <h4 className="font-medium">{otherParty.full_name}</h4>
                  <div className="flex items-center gap-1">
                    <StarRating
                      rating={otherParty.rating}
                      size="sm"
                      showNumber
                    />
                    <span className="text-xs text-gray-500">
                      ({otherParty.total_reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/orders/${order.id}/messages`}>
                <Button className="w-full" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View Messages
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
