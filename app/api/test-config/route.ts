import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ? "Set" : "Missing",
    resendKey: process.env.RESEND_API_KEY ? "Set" : "Missing",
  })
} 