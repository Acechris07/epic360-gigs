import { type NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Check if services table exists
    const { data: tableExists, error: tableError } = await supabase
      .from('services')
      .select('count')
      .limit(1);

    if (tableError) {
      return NextResponse.json(
        {
          error: 'Services table does not exist or is not accessible',
          details: tableError.message,
        },
        { status: 404 }
      );
    }

    // Check RLS policies
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: 'Not authenticated',
          details: authError?.message,
        },
        { status: 401 }
      );
    }

    // Try to insert a test service
    const { data: insertData, error: insertError } = await supabase
      .from('services')
      .insert({
        provider_id: user.id,
        title: 'Test Service',
        description: 'This is a test service',
        category: 'IT Gigs',
        price: 50.0,
        delivery_time: 3,
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        {
          error: 'Failed to insert test service',
          details: insertError.message,
          code: insertError.code,
        },
        { status: 500 }
      );
    }

    // Clean up - delete the test service
    await supabase.from('services').delete().eq('id', insertData.id);

    return NextResponse.json({
      success: true,
      message: 'Services table is working correctly',
      testService: insertData,
    });
  } catch (error) {
    console.error('Test services error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
