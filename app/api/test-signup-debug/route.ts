import { type NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName } = body;

    console.log('Debug signup attempt:', { email, fullName });

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Test database connection first
    console.log('Testing database connection...');
    const { data: dbTest, error: dbError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (dbError) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json(
        {
          error: 'Database connection failed',
          details: dbError.message,
          code: dbError.code,
        },
        { status: 500 }
      );
    }

    console.log('Database connection successful');

    // Check if user already exists
    console.log('Checking if user exists...');
    const { data: existingUser, error: existingError } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      console.error('Error checking existing user:', existingError);
      return NextResponse.json(
        {
          error: 'Error checking existing user',
          details: existingError.message,
        },
        { status: 500 }
      );
    }

    if (existingUser) {
      console.log('User already exists');
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    console.log("User doesn't exist, proceeding with signup");

    // Create user
    console.log('Creating user in Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          full_name: fullName,
        },
      },
    });

    console.log('Auth result:', {
      success: !authError,
      userId: authData?.user?.id,
      error: authError?.message,
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        {
          error: 'Failed to create account',
          details: authError.message,
          code: authError.status,
        },
        { status: 500 }
      );
    }

    // Create profile
    if (authData.user) {
      console.log('Creating profile for user:', authData.user.id);
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        is_freelancer: false,
        is_client: true,
      });

      console.log('Profile creation result:', {
        success: !profileError,
        error: profileError?.message,
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't fail the signup if profile creation fails
        return NextResponse.json({
          message: 'Account created but profile creation failed',
          user: authData.user,
          profileError: profileError.message,
        });
      }
    }

    console.log('Signup completed successfully');
    return NextResponse.json({
      message: 'Account created successfully',
      user: authData.user,
    });
  } catch (error) {
    console.error('Debug signup error:', error);
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
