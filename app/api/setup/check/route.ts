import { NextResponse } from "next/server"

export async function GET() {
  try {
    const checks = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      siteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
      databaseTables: false, // Would need actual DB check
      emailService: false, // Would need Supabase API check
    }

    return NextResponse.json({
      success: true,
      checks,
      allReady: Object.values(checks).every(Boolean),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Setup check failed",
      },
      { status: 500 },
    )
  }
}
