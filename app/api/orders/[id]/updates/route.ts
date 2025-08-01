import { type NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

const createUpdateSchema = z.object({
  message: z.string().min(1).max(1000),
});

export async function GET(
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

    // Check if user has access to this order
    const { data: order } = await supabase
      .from('orders')
      .select('id, client_id, freelancer_id')
      .eq('id', orderId)
      .single();

    if (
      !order ||
      (order.client_id !== user.id && order.freelancer_id !== user.id)
    ) {
      return NextResponse.json(
        { error: 'Not authorized to view this order' },
        { status: 403 }
      );
    }

    // Get order updates with user information
    const { data: updates, error } = await supabase
      .from('order_updates')
      .select(
        `
        id,
        status,
        message,
        created_at,
        user:profiles!order_updates_user_id_fkey(id, full_name, avatar_url)
      `
      )
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Order updates fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch order updates' },
        { status: 500 }
      );
    }

    return NextResponse.json({ updates });
  } catch (error) {
    console.error('Order updates fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const validatedData = createUpdateSchema.parse(body);
    const { message } = validatedData;

    // Check if user has access to this order
    const { data: order } = await supabase
      .from('orders')
      .select('id, client_id, freelancer_id, status')
      .eq('id', orderId)
      .single();

    if (
      !order ||
      (order.client_id !== user.id && order.freelancer_id !== user.id)
    ) {
      return NextResponse.json(
        { error: 'Not authorized to update this order' },
        { status: 403 }
      );
    }

    // Create the update
    const { data: update, error } = await supabase
      .from('order_updates')
      .insert({
        order_id: orderId,
        user_id: user.id,
        status: order.status,
        message,
      })
      .select(
        `
        id,
        status,
        message,
        created_at,
        user:profiles!order_updates_user_id_fkey(id, full_name, avatar_url)
      `
      )
      .single();

    if (error) {
      console.error('Order update creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create order update' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Order update created successfully',
      update,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Order update creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
