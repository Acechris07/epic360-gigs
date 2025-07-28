import { NextResponse } from "next/server"

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  return NextResponse.json({
    siteUrl,
    isConfigured: !!siteUrl,
    environment: process.env.NODE_ENV,
    recommendations: {
      development: "http://localhost:3000",
      production: "https://yourdomain.com",
      vercel: "Use VERCEL_URL for automatic deployment URLs",
    },
  })
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    // In a real app, you might want to save this to a database
    // For now, we'll just validate and return guidance

    return NextResponse.json({
      message: "URL validated successfully",
      url,
      nextSteps: [
        "Add this URL to your .env.local file",
        "Restart your development server",
        "Update your Supabase project settings",
      ],
    })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
