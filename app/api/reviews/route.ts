import { type NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

const createReviewSchema = z.object({
  orderId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1).max(1000).optional(),
});

const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1).max(1000).optional(),
});

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const validatedData = createReviewSchema.parse(body);
    const { orderId, rating, comment } = validatedData;

    // Check if order exists and user is involved
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, client_id, freelancer_id, status')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if user is client or freelancer for this order
    if (order.client_id !== user.id && order.freelancer_id !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to review this order' },
        { status: 403 }
      );
    }

    // Check if order is completed
    if (order.status !== 'completed') {
      return NextResponse.json(
        { error: 'Can only review completed orders' },
        { status: 400 }
      );
    }

    // Determine who is being reviewed (the other person in the order)
    const reviewedId =
      order.client_id === user.id ? order.freelancer_id : order.client_id;

    // Check if user already reviewed this order
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('order_id', orderId)
      .eq('reviewer_id', user.id)
      .single();

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this order' },
        { status: 400 }
      );
    }

    // Create the review
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        order_id: orderId,
        reviewer_id: user.id,
        reviewee_id: reviewedId,
        rating,
        comment,
      })
      .select()
      .single();

    if (reviewError) {
      console.error('Review creation error:', reviewError);
      return NextResponse.json(
        { error: 'Failed to create review' },
        { status: 500 }
      );
    }

    // Update the reviewed user's average rating
    await updateUserRating(supabase, reviewedId);

    return NextResponse.json({
      message: 'Review created successfully',
      review,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Review creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const orderId = searchParams.get('orderId');

    if (!userId && !orderId) {
      return NextResponse.json(
        { error: 'userId or orderId is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('reviews')
      .select(
        `
        id,
        rating,
        comment,
        created_at,
        reviewer:profiles!reviews_reviewer_id_fkey(id, full_name, avatar_url),
        reviewee:profiles!reviews_reviewee_id_fkey(id, full_name, avatar_url),
        order:orders!reviews_order_id_fkey(id, gig:gigs!orders_gig_id_fkey(title))
      `
      )
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('reviewee_id', userId);
    }

    if (orderId) {
      query = query.eq('order_id', orderId);
    }

    const { data: reviews, error } = await query;

    if (error) {
      console.error('Reviews fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Reviews fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function updateUserRating(supabase: any, userId: string) {
  try {
    // Get all reviews for the user
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('reviewee_id', userId);

    if (reviews && reviews.length > 0) {
      const totalRating = reviews.reduce(
        (sum: number, review: any) => sum + review.rating,
        0
      );
      const averageRating = totalRating / reviews.length;

      // Update user's profile with new rating
      await supabase
        .from('profiles')
        .update({
          rating: Math.round(averageRating * 100) / 100, // Round to 2 decimal places
          total_reviews: reviews.length,
        })
        .eq('id', userId);
    }
  } catch (error) {
    console.error('Error updating user rating:', error);
  }
}
