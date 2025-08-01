import { type NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

const updateStatusSchema = z.object({
  status: z.enum([
    'pending',
    'in_progress',
    'completed',
    'cancelled',
    'disputed',
  ]),
  message: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orderId = params.id;
    const body = await request.json();
    const validatedData = updateStatusSchema.parse(body);
    const { status, message } = validatedData;

    // Get the current order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, client_id, freelancer_id, status')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if user is authorized to update this order
    if (order.client_id !== user.id && order.freelancer_id !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to update this order' },
        { status: 403 }
      );
    }

    // Validate status transitions based on user role
    const isClient = order.client_id === user.id;
    const isFreelancer = order.freelancer_id === user.id;
    const currentStatus = order.status;

    // Define allowed status transitions
    const allowedTransitions = {
      client: {
        pending: ['cancelled', 'disputed'],
        in_progress: ['disputed'],
        completed: [],
        cancelled: [],
        disputed: [],
      },
      freelancer: {
        pending: ['in_progress', 'cancelled'],
        in_progress: ['completed', 'disputed'],
        completed: [],
        cancelled: [],
        disputed: [],
      },
    };

    const userRole = isClient ? 'client' : 'freelancer';
    const allowedStatuses = allowedTransitions[userRole][currentStatus] || [];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Cannot change status from ${currentStatus} to ${status}. Allowed transitions: ${allowedStatuses.join(
            ', '
          )}`,
        },
        { status: 400 }
      );
    }

    // Update order status
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Set completed_date if status is being updated to completed
    if (status === 'completed') {
      updateData.completed_date = new Date().toISOString();
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      console.error('Order status update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 }
      );
    }

    // Create a status update record for tracking
    if (message) {
      await supabase.from('order_updates').insert({
        order_id: orderId,
        user_id: user.id,
        status,
        message,
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      message: 'Order status updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Order status update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
