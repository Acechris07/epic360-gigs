import { type NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

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

    // Get order with related data
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(
        `
        *,
        gig:gigs(
          id,
          title,
          description,
          category,
          price,
          delivery_time,
          images
        ),
        client:profiles!orders_client_id_fkey(
          id,
          full_name,
          avatar_url,
          rating,
          total_reviews
        ),
        freelancer:profiles!orders_freelancer_id_fkey(
          id,
          full_name,
          avatar_url,
          rating,
          total_reviews
        )
      `
      )
      .eq('id', orderId)
      .single();

    if (orderError) {
      console.error('Order fetch error:', orderError);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if user is authorized to view this order
    if (order.client_id !== user.id && order.freelancer_id !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to view this order' },
        { status: 403 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
