"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft, 
  Clock, 
  DollarSign, 
  User, 
  Calendar, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare,
  Edit
} from 'lucide-react'
import Link from 'next/link'
import { 
  getOrder, 
  updateOrder, 
  Order, 
  getOrderStatusInfo, 
  formatOrderAmount, 
  getOrderTitle,
  getOrderCategory,
  getOrderImages,
  canUpdateOrderStatus
} from '@/lib/orders'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)
  const [showStatusUpdate, setShowStatusUpdate] = useState(false)
  const [newStatus, setNewStatus] = useState<Order['status']>('pending')

  const orderId = params.id as string

  useEffect(() => {
    if (user && orderId) {
      loadOrder()
    }
  }, [user, orderId])

  const loadOrder = async () => {
    try {
      setLoading(true)
      const fetchedOrder = await getOrder(orderId)
      setOrder(fetchedOrder)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load order')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!order || !user) return

    const permissionCheck = canUpdateOrderStatus(order, user.id, newStatus)
    if (!permissionCheck.canUpdate) {
      setError(permissionCheck.reason || 'Cannot update order status')
      return
    }

    try {
      setUpdating(true)
      const updatedOrder = await updateOrder(order.id, { status: newStatus })
      setOrder(updatedOrder)
      setShowStatusUpdate(false)
      setError('')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update order')
    } finally {
      setUpdating(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view this order</h1>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading order...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
          <Link href="/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    )
  }

  const statusInfo = getOrderStatusInfo(order.status)
  const orderTitle = getOrderTitle(order)
  const orderCategory = getOrderCategory(order)
  const orderImages = getOrderImages(order)
  const isClient = order.client_id === user.id
  const isFreelancer = order.freelancer_id === user.id
  const otherParty = isClient ? order.freelancer : order.client

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/orders" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Details</h1>
            <p className="text-gray-600">Order #{order.id.slice(0, 8)}</p>
          </div>
          <Badge className={`text-lg px-4 py-2 ${statusInfo.color}`}>
            {statusInfo.icon} {statusInfo.label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-xl mb-2">{orderTitle}</h3>
                <p className="text-gray-600">{orderCategory}</p>
              </div>

              {orderImages.length > 0 && (
                <div>
                  <img
                    src={orderImages[0]}
                    alt={orderTitle}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              {order.requirements && (
                <div>
                  <Label className="font-medium">Requirements</Label>
                  <p className="text-gray-600 mt-1">{order.requirements}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-green-600">
                    {formatOrderAmount(order.total_amount)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
                {order.delivery_date && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Expected Delivery:</span>
                    <span className="font-medium">
                      {new Date(order.delivery_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {order.completed_date && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-medium">
                      {new Date(order.completed_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status Update */}
          {(isClient || isFreelancer) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Update Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showStatusUpdate ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="status">New Status</Label>
                      <Select value={newStatus} onValueChange={(value: Order['status']) => setNewStatus(value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['pending', 'in_progress', 'completed', 'cancelled', 'disputed'].map((status) => {
                            const statusConfig = getOrderStatusInfo(status as Order['status'])
                            const permissionCheck = canUpdateOrderStatus(order, user.id, status as Order['status'])
                            
                            return (
                              <SelectItem 
                                key={status} 
                                value={status}
                                disabled={!permissionCheck.canUpdate}
                              >
                                {statusConfig.icon} {statusConfig.label}
                                {!permissionCheck.canUpdate && ' (Not allowed)'}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={handleStatusUpdate}
                        disabled={updating}
                        className="flex-1"
                      >
                        {updating ? 'Updating...' : 'Update Status'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowStatusUpdate(false)
                          setError('')
                        }}
                        disabled={updating}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => setShowStatusUpdate(true)}>
                    Update Status
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-gray-600">
                  {isClient ? 'Freelancer' : 'Client'}
                </Label>
                <div className="flex items-center gap-3 mt-2">
                  {otherParty?.avatar_url ? (
                    <img
                      src={otherParty.avatar_url}
                      alt={otherParty.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{otherParty?.full_name || 'Unknown'}</p>
                    <p className="text-sm text-gray-600">{otherParty?.email}</p>
                    {otherParty?.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm">{otherParty.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/orders/${order.id}/messages`} className="w-full">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View Messages
                </Button>
              </Link>
              
              {order.status === 'completed' && (
                <Link href={`/orders/${order.id}/review`} className="w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Leave Review
                  </Button>
                </Link>
              )}

              {order.status === 'pending' && isClient && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={() => {
                    setNewStatus('cancelled')
                    setShowStatusUpdate(true)
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Order
                </Button>
              )}

              {(order.status === 'pending' || order.status === 'in_progress') && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-orange-600 hover:text-orange-700"
                  onClick={() => {
                    setNewStatus('disputed')
                    setShowStatusUpdate(true)
                  }}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Dispute Order
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Order Created</p>
                    <p className="text-xs text-gray-600">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {order.status !== 'pending' && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Status Updated</p>
                      <p className="text-xs text-gray-600">
                        {new Date(order.updated_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {order.completed_date && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Order Completed</p>
                      <p className="text-xs text-gray-600">
                        {new Date(order.completed_date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 