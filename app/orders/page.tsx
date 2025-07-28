"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Clock, 
  DollarSign, 
  User, 
  Calendar, 
  Search, 
  Filter,
  Eye,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'
import { 
  getOrders, 
  Order, 
  getOrderStatusInfo, 
  formatOrderAmount, 
  getOrderTitle,
  getOrderCategory,
  getOrderImages
} from '@/lib/orders'

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState<'client' | 'freelancer'>('client')

  useEffect(() => {
    if (user) {
      loadOrders()
    }
  }, [user, statusFilter, roleFilter])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const params: any = { role: roleFilter }
      if (statusFilter !== 'all') {
        params.status = statusFilter
      }
      const fetchedOrders = await getOrders(params)
      setOrders(fetchedOrders)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getFilteredOrders = () => {
    if (activeTab === 'all') return orders
    
    return orders.filter(order => {
      switch (activeTab) {
        case 'pending':
          return order.status === 'pending'
        case 'in_progress':
          return order.status === 'in_progress'
        case 'completed':
          return order.status === 'completed'
        case 'cancelled':
          return order.status === 'cancelled'
        case 'disputed':
          return order.status === 'disputed'
        default:
          return true
      }
    })
  }

  const filteredOrders = getFilteredOrders()

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your orders</h1>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">Track and manage your orders</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">Role:</span>
          <Select value={roleFilter} onValueChange={(value: 'client' | 'freelancer') => setRoleFilter(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client">As Client</SelectItem>
              <SelectItem value="freelancer">As Freelancer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="disputed">Disputed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          <TabsTrigger value="disputed">Disputed</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading orders...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadOrders}>Try Again</Button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No orders found</p>
          <Link href="/browse">
            <Button>Browse Services</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => {
            const statusInfo = getOrderStatusInfo(order.status)
            const orderTitle = getOrderTitle(order)
            const orderCategory = getOrderCategory(order)
            const orderImages = getOrderImages(order)
            const isClient = order.client_id === user.id
            const otherParty = isClient ? order.freelancer : order.client

            return (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Order Image */}
                    <div className="flex-shrink-0">
                      {orderImages.length > 0 ? (
                        <img
                          src={orderImages[0]}
                          alt={orderTitle}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-2xl">📋</span>
                        </div>
                      )}
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">{orderTitle}</h3>
                          <p className="text-sm text-gray-600">{orderCategory}</p>
                        </div>
                        <Badge className={statusInfo.color}>
                          {statusInfo.icon} {statusInfo.label}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            {isClient ? 'Freelancer:' : 'Client:'}
                          </span>
                          <span className="font-medium truncate">
                            {otherParty?.full_name || 'Unknown'}
                          </span>
                        </div>
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
                      </div>

                      {order.requirements && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Requirements:</span> {order.requirements}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link href={`/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </Link>
                        <Link href={`/orders/${order.id}/messages`}>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Messages
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
} 