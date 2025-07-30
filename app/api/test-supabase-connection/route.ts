import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing Supabase environment variables',
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
        },
        { status: 500 }
      );
    }

    // Create a simple Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test basic connection by trying to access auth
    const { data: authData, error: authError } =
      await supabase.auth.getSession();

    if (authError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Supabase connection failed',
          details: authError.message,
          code: authError.status,
        },
        { status: 500 }
      );
    }

    // Test database access
    const { data: dbData, error: dbError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      auth: '✅ Working',
      database: dbError
        ? '❌ Database access failed'
        : '✅ Database accessible',
      dbError: dbError?.message,
      url: supabaseUrl,
      keyPrefix: supabaseKey.substring(0, 20) + '...',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Connection test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
