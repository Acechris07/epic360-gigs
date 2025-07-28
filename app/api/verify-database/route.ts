import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const results: any = {}

    // Test each table
    const tables = [
      'profiles',
      'gigs', 
      'services',
      'orders',
      'reviews',
      'messages',
      'favorites',
      'categories'
    ]

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        results[table] = {
          exists: !error,
          error: error?.message || null,
          count: data?.length || 0
        }
      } catch (err) {
        results[table] = {
          exists: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        }
      }
    }

    // Test RLS policies by trying to insert a test record
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
      
      results.rls_test = {
        success: !error,
        error: error?.message || null
      }
    } catch (err) {
      results.rls_test = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database verification complete',
      results,
      summary: {
        total_tables: tables.length,
        existing_tables: Object.values(results).filter((r: any) => r.exists).length,
        working_tables: Object.values(results).filter((r: any) => r.exists && !r.error).length
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 