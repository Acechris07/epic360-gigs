'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  completed_date: string | null;
  gig: {
    title: string;
  };
  client: {
    full_name: string;
  };
  freelancer: {
    full_name: string;
  };
}

export default function TrackingPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        console.error('Failed to fetch orders:', data.error);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
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
          icon: <CheckCircle className="h-4 w-4" />,
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          color: 'bg-red-100 text-red-800',
          icon: <XCircle className="h-4 w-4" />,
        };
      case 'disputed':
        return {
          label: 'Disputed',
          color: 'bg-orange-100 text-orange-800',
          icon: <AlertTriangle className="h-4 w-4" />,
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getFilteredOrders = () => {
    if (activeTab === 'all') return orders;

    return orders.filter(order => {
      switch (activeTab) {
        case 'pending':
          return order.status === 'pending';
        case 'in_progress':
          return order.status === 'in_progress';
        case 'completed':
          return order.status === 'completed';
        case 'cancelled':
          return order.status === 'cancelled';
        case 'disputed':
          return order.status === 'disputed';
        default:
          return true;
      }
    });
  };

  const filteredOrders = getFilteredOrders();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please sign in to view order tracking
          </h1>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Tracking
        </h1>
        <p className="text-gray-600">
          Track the progress of all your orders and projects
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  {orders.filter(o => o.status === 'in_progress').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Issues</p>
                <p className="text-2xl font-bold text-red-600">
                  {
                    orders.filter(
                      o => o.status === 'cancelled' || o.status === 'disputed'
                    ).length
                  }
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              <TabsTrigger value="disputed">Disputed</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === 'all'
                  ? "You haven't placed or received any orders yet."
                  : `No ${activeTab.replace('_', ' ')} orders found.`}
              </p>
              <Link href="/browse">
                <Button>Browse Services</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => {
                const statusInfo = getStatusInfo(order.status);
                return (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {statusInfo.icon}
                        <Badge className={statusInfo.color}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {formatAmount(order.total_amount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Created {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {order.gig.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {user.id === order.client.id
                          ? 'Freelancer: '
                          : 'Client: '}
                        {user.id === order.client.id
                          ? order.freelancer.full_name
                          : order.client.full_name}
                      </p>
                    </div>

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
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
