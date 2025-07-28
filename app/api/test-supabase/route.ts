import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      data: data,
      env: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      env: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
      }
    }, { status: 500 })
  }
} 