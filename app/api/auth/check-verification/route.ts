import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { validateEmail } from "@/lib/auth-security"
import { checkRateLimit } from "@/lib/rate-limit"
import { z } from "zod"

const checkVerificationSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip ?? "127.0.0.1"
    await checkRateLimit(`check_verification:${ip}`, 5, 15 * 60 * 1000) // 5 attempts per 15 minutes

    const body = await request.json()
    const { email } = checkVerificationSchema.parse(body)

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Check if user exists and get verification status
    const { data: users, error: userError } = await supabase.auth.admin.listUsers()

    if (userError) {
      return NextResponse.json({ 
        exists: false,
        verified: false,
        message: "User not found"
      })
    }

    const user = users.users.find(u => u.email === email)

    if (!user) {
      return NextResponse.json({ 
        exists: false,
        verified: false,
        message: "User not found"
      })
    }

    const isVerified = !!user.email_confirmed_at

    return NextResponse.json({
      exists: true,
      verified: isVerified,
      message: isVerified ? "Email is verified" : "Email is not verified"
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    if (error instanceof Error && error.message === "Rate limit exceeded") {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 })
    }

    console.error("Check verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 