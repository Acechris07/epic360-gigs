import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { validateEmail } from "@/lib/auth-security"
import { checkRateLimit } from "@/lib/rate-limit"
import { EmailService } from "@/lib/email"
import { z } from "zod"

const resendVerificationSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - more restrictive for resend
    const ip = request.ip ?? "127.0.0.1"
    await checkRateLimit(`resend_verification:${ip}`, 3, 15 * 60 * 1000) // 3 attempts per 15 minutes

    const body = await request.json()
    const { email } = resendVerificationSchema.parse(body)

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Check if user exists and email is not verified
    const { data: users, error: userError } = await supabase.auth.admin.listUsers()

    if (userError) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message: "If an account with that email exists and is not verified, we sent you a verification email.",
      })
    }

    const user = users.users.find(u => u.email === email)

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message: "If an account with that email exists and is not verified, we sent you a verification email.",
      })
    }

    // Check if email is already verified
    if (user.email_confirmed_at) {
      return NextResponse.json({
        message: "Email is already verified. You can sign in with your account.",
      })
    }

    // Resend verification email
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      }
    })

    if (error) {
      console.error("Resend verification error:", error)
      // Don't reveal specific error details
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      message: "If an account with that email exists and is not verified, we sent you a verification email.",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    if (error instanceof Error && error.message === "Rate limit exceeded") {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 })
    }

    console.error("Resend verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 