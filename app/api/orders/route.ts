import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { z } from 'zod'

const createOrderSchema = z.object({
  gig_id: z.string().uuid().optional(),
  service_id: z.string().uuid().optional(),
  freelancer_id: z.string().uuid(),
  total_amount: z.number().positive(),
  requirements: z.string().optional(),
  delivery_date: z.string().datetime().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createOrderSchema.parse(body)

    // Ensure either gig_id or service_id is provided
    if (!validatedData.gig_id && !validatedData.service_id) {
      return NextResponse.json({ error: 'Either gig_id or service_id is required' }, { status: 400 })
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        gig_id: validatedData.gig_id,
        service_id: validatedData.service_id,
        client_id: user.id,
        freelancer_id: validatedData.freelancer_id,
        total_amount: validatedData.total_amount,
        requirements: validatedData.requirements,
        delivery_date: validatedData.delivery_date,
        status: 'pending'
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Order created successfully',
      order
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }

    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const role = searchParams.get('role') // 'client' or 'freelancer'

    let query = supabase
      .from('orders')
      .select(`
        *,
        gig:gigs(title, description, category),
        service:services(title, description, category),
        client:profiles!orders_client_id_fkey(full_name, email, avatar_url),
        freelancer:profiles!orders_freelancer_id_fkey(full_name, email, avatar_url)
      `)

    // Filter by role
    if (role === 'client') {
      query = query.eq('client_id', user.id)
    } else if (role === 'freelancer') {
      query = query.eq('freelancer_id', user.id)
    } else {
      // Default: show orders where user is either client or freelancer
      query = query.or(`client_id.eq.${user.id},freelancer_id.eq.${user.id}`)
    }

    // Filter by status
    if (status) {
      query = query.eq('status', status)
    }

    // Order by created_at desc
    query = query.order('created_at', { ascending: false })

    const { data: orders, error } = await query

    if (error) {
      console.error('Orders fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    return NextResponse.json({ orders })

  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 