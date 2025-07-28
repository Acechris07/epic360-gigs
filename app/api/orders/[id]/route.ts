import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { z } from 'zod'

const updateOrderSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled', 'disputed']).optional(),
  requirements: z.string().optional(),
  delivery_date: z.string().datetime().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get order with related data
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        gig:gigs(title, description, category, price, delivery_time, images),
        service:services(title, description, category, price, delivery_time, images),
        client:profiles!orders_client_id_fkey(full_name, email, avatar_url, rating),
        freelancer:profiles!orders_freelancer_id_fkey(full_name, email, avatar_url, rating)
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Order fetch error:', error)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if user has access to this order
    if (order.client_id !== user.id && order.freelancer_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json({ order })

  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get order to check permissions
    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('client_id, freelancer_id, status')
      .eq('id', params.id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if user has access to this order
    if (existingOrder.client_id !== user.id && existingOrder.freelancer_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateOrderSchema.parse(body)

    // Status update permissions
    if (validatedData.status) {
      const isClient = existingOrder.client_id === user.id
      const isFreelancer = existingOrder.freelancer_id === user.id

      // Only freelancers can mark as in_progress or completed
      if (['in_progress', 'completed'].includes(validatedData.status) && !isFreelancer) {
        return NextResponse.json({ error: 'Only freelancers can update order status to in_progress or completed' }, { status: 403 })
      }

      // Only clients can cancel orders (if still pending)
      if (validatedData.status === 'cancelled' && !isClient) {
        return NextResponse.json({ error: 'Only clients can cancel orders' }, { status: 403 })
      }

      // Both parties can dispute
      if (validatedData.status === 'disputed' && !isClient && !isFreelancer) {
        return NextResponse.json({ error: 'Unauthorized to dispute order' }, { status: 403 })
      }
    }

    // Update order
    const updateData: any = { ...validatedData }
    
    // Set completed_date if status is being updated to completed
    if (validatedData.status === 'completed') {
      updateData.completed_date = new Date().toISOString()
    }

    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      console.error('Order update error:', updateError)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Order updated successfully',
      order
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }

    console.error('Order update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 