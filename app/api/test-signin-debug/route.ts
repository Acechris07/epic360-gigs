import { type NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('Debug signin attempt:', { email });

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Check if user exists in profiles table
    console.log('Checking if user exists in profiles...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('email', email)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error checking profile:', profileError);
      return NextResponse.json(
        {
          error: 'Error checking user profile',
          details: profileError.message,
        },
        { status: 500 }
      );
    }

    if (!profile) {
      console.log('User not found in profiles table');
      return NextResponse.json(
        {
          error: 'User not found',
          details: 'No profile found for this email address',
        },
        { status: 404 }
      );
    }

    console.log('User found in profiles:', profile.id);

    // Try to sign in
    console.log('Attempting sign in...');
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    console.log('Auth result:', {
      success: !authError,
      userId: authData?.user?.id,
      error: authError?.message,
      status: authError?.status,
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        {
          error: 'Sign in failed',
          details: authError.message,
          code: authError.status,
          hint: authError.message.includes('Email not confirmed')
            ? 'Please check your email and click the verification link'
            : 'Check your email and password',
        },
        { status: 400 }
      );
    }

    console.log('Sign in successful');
    return NextResponse.json({
      message: 'Sign in successful',
      user: authData.user,
      profile: profile,
    });
  } catch (error) {
    console.error('Debug signin error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
