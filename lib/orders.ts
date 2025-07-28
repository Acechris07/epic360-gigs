import { supabase } from './supabase'

export interface Order {
  id: string
  gig_id?: string
  service_id?: string
  client_id: string
  freelancer_id: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
  total_amount: number
  requirements?: string
  delivery_date?: string
  completed_date?: string
  created_at: string
  updated_at: string
  gig?: {
    title: string
    description: string
    category: string
    price: number
    delivery_time: number
    images?: string[]
  }
  service?: {
    title: string
    description: string
    category: string
    price: number
    delivery_time: number
    images?: string[]
  }
  client?: {
    full_name: string
    email: string
    avatar_url?: string
    rating?: number
  }
  freelancer?: {
    full_name: string
    email: string
    avatar_url?: string
    rating?: number
  }
}

export interface CreateOrderData {
  gig_id?: string
  service_id?: string
  freelancer_id: string
  total_amount: number
  requirements?: string
  delivery_date?: string
}

export interface UpdateOrderData {
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
  requirements?: string
  delivery_date?: string
}

// Create a new order
export const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create order')
  }

  const result = await response.json()
  return result.order
}

// Get orders for current user
export const getOrders = async (params?: {
  status?: string
  role?: 'client' | 'freelancer'
}): Promise<Order[]> => {
  const searchParams = new URLSearchParams()
  if (params?.status) searchParams.append('status', params.status)
  if (params?.role) searchParams.append('role', params.role)

  const response = await fetch(`/api/orders?${searchParams.toString()}`)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch orders')
  }

  const result = await response.json()
  return result.orders
}

// Get a specific order
export const getOrder = async (orderId: string): Promise<Order> => {
  const response = await fetch(`/api/orders/${orderId}`)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch order')
  }

  const result = await response.json()
  return result.order
}

// Update an order
export const updateOrder = async (orderId: string, updateData: UpdateOrderData): Promise<Order> => {
  const response = await fetch(`/api/orders/${orderId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update order')
  }

  const result = await response.json()
  return result.order
}

// Get order status display info
export const getOrderStatusInfo = (status: Order['status']) => {
  const statusConfig = {
    pending: {
      label: 'Pending',
      color: 'bg-yellow-100 text-yellow-800',
      icon: '⏳',
      description: 'Order is waiting for freelancer to start work'
    },
    in_progress: {
      label: 'In Progress',
      color: 'bg-blue-100 text-blue-800',
      icon: '🔄',
      description: 'Work is currently being done'
    },
    completed: {
      label: 'Completed',
      color: 'bg-green-100 text-green-800',
      icon: '✅',
      description: 'Order has been completed successfully'
    },
    cancelled: {
      label: 'Cancelled',
      color: 'bg-red-100 text-red-800',
      icon: '❌',
      description: 'Order has been cancelled'
    },
    disputed: {
      label: 'Disputed',
      color: 'bg-orange-100 text-orange-800',
      icon: '⚠️',
      description: 'Order is under dispute resolution'
    }
  }

  return statusConfig[status]
}

// Check if user can update order status
export const canUpdateOrderStatus = (
  order: Order,
  userId: string,
  newStatus: Order['status']
): { canUpdate: boolean; reason?: string } => {
  const isClient = order.client_id === userId
  const isFreelancer = order.freelancer_id === userId

  if (!isClient && !isFreelancer) {
    return { canUpdate: false, reason: 'You are not authorized to update this order' }
  }

  // Status transition rules
  const allowedTransitions: Record<Order['status'], Record<'client' | 'freelancer', Order['status'][]>> = {
    pending: {
      client: ['cancelled', 'disputed'],
      freelancer: ['in_progress', 'disputed']
    },
    in_progress: {
      client: ['disputed'],
      freelancer: ['completed', 'disputed']
    },
    completed: {
      client: ['disputed'],
      freelancer: []
    },
    cancelled: {
      client: [],
      freelancer: []
    },
    disputed: {
      client: [],
      freelancer: []
    }
  }

  const currentStatus = order.status
  const userRole = isClient ? 'client' : 'freelancer'
  const allowedStatuses = allowedTransitions[currentStatus]?.[userRole] || []

  if (!allowedStatuses.includes(newStatus)) {
    return { 
      canUpdate: false, 
      reason: `Cannot change status from ${currentStatus} to ${newStatus}` 
    }
  }

  return { canUpdate: true }
}

// Format order amount
export const formatOrderAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

// Get order title (from gig or service)
export const getOrderTitle = (order: Order): string => {
  return order.gig?.title || order.service?.title || 'Untitled Order'
}

// Get order category (from gig or service)
export const getOrderCategory = (order: Order): string => {
  return order.gig?.category || order.service?.category || 'General'
}

// Get order images (from gig or service)
export const getOrderImages = (order: Order): string[] => {
  return order.gig?.images || order.service?.images || []
} 