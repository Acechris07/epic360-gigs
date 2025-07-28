import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Count unread messages
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', user.id)
      .eq('is_read', false)

    if (error) {
      console.error('Unread count error:', error)
      return NextResponse.json({ error: 'Failed to get unread count' }, { status: 500 })
    }

    return NextResponse.json({ count: count || 0 })

  } catch (error) {
    console.error('Unread count error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 