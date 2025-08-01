'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare,
  User,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrderUpdate {
  id: string;
  status: string;
  message: string;
  created_at: string;
  user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

interface OrderTrackingProps {
  orderId: string;
  currentStatus: string;
  isClient: boolean;
  isFreelancer: boolean;
  onStatusUpdate?: () => void;
}

export function OrderTracking({
  orderId,
  currentStatus,
  isClient,
  isFreelancer,
  onStatusUpdate,
}: OrderTrackingProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [updates, setUpdates] = useState<OrderUpdate[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [message, setMessage] = useState('');
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUpdates();
  }, [orderId]);

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/updates`);
      const data = await response.json();
      if (response.ok) {
        setUpdates(data.updates || []);
      }
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === currentStatus) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          message: message.trim() || undefined,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Status updated successfully!',
        });
        setShowStatusForm(false);
        setMessage('');
        fetchUpdates();
        onStatusUpdate?.();
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddUpdate = async () => {
    if (!message.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (response.ok) {
        toast({ title: 'Success', description: 'Update added successfully!' });
        setShowUpdateForm(false);
        setMessage('');
        fetchUpdates();
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add update',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
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

  const getStatusOptions = () => {
    if (isClient) {
      if (currentStatus === 'pending') return ['cancelled', 'disputed'];
      if (currentStatus === 'in_progress') return ['disputed'];
    } else if (isFreelancer) {
      if (currentStatus === 'pending') return ['in_progress', 'cancelled'];
      if (currentStatus === 'in_progress') return ['completed', 'disputed'];
    }
    return [];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Status Update Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Order Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {(() => {
                const statusInfo = getStatusInfo(currentStatus);
                return (
                  <>
                    {statusInfo.icon}
                    <Badge className={statusInfo.color}>
                      {statusInfo.label}
                    </Badge>
                  </>
                );
              })()}
            </div>
            <Button
              onClick={() => setShowStatusForm(true)}
              variant="outline"
              size="sm"
            >
              Update Status
            </Button>
          </div>

          {showStatusForm && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getStatusOptions().map(status => (
                      <SelectItem key={status} value={status}>
                        {getStatusInfo(status).label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (optional)
                </label>
                <Textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Add a note about this status change..."
                  rows={3}
                  maxLength={500}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleStatusUpdate}
                  disabled={submitting || newStatus === currentStatus}
                >
                  {submitting ? 'Updating...' : 'Update Status'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowStatusForm(false);
                    setMessage('');
                    setNewStatus(currentStatus);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Updates Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Order Timeline
            </CardTitle>
            <Button
              onClick={() => setShowUpdateForm(true)}
              variant="outline"
              size="sm"
            >
              Add Update
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showUpdateForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Message
                </label>
                <Textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Share an update about the order..."
                  rows={3}
                  maxLength={1000}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleAddUpdate}
                  disabled={submitting || !message.trim()}
                >
                  {submitting ? 'Adding...' : 'Add Update'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowUpdateForm(false);
                    setMessage('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading updates...</p>
            </div>
          ) : updates.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No updates yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {updates.map(update => (
                <div key={update.id} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      {update.user.avatar_url ? (
                        <img
                          src={update.user.avatar_url}
                          alt={update.user.full_name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <User className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">
                        {update.user.full_name}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {getStatusInfo(update.status).label}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatDate(update.created_at)}
                      </span>
                    </div>
                    {update.message && (
                      <p className="text-gray-700 text-sm">{update.message}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
