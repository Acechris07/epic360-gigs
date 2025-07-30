import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (connectionError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection failed',
          details: connectionError.message,
        },
        { status: 500 }
      );
    }

    // Test if profiles table exists and has correct structure
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Profiles table access failed',
          details: profilesError.message,
        },
        { status: 500 }
      );
    }

    // Test RLS policies
    const { data: rlsTest, error: rlsError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .limit(1);

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      tables: {
        profiles: '✅ Accessible',
      },
      rls: rlsError ? '❌ RLS issues detected' : '✅ RLS working correctly',
      sampleData: profiles?.length > 0 ? '✅ Data found' : 'ℹ️ No data yet',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Database test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
