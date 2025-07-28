import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { validateEmail } from "@/lib/auth-security"
import { checkRateLimit } from "@/lib/rate-limit"
import { z } from "zod"

const resendPasswordResetSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - more restrictive for resend
    const ip = request.ip ?? "127.0.0.1"
    await checkRateLimit(`resend_password_reset:${ip}`, 2, 15 * 60 * 1000) // 2 attempts per 15 minutes

    const body = await request.json()
    const { email } = resendPasswordResetSchema.parse(body)

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Check if user exists
    const { data: users, error: userError } = await supabase.auth.admin.listUsers()

    if (userError) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message: "If an account with that email exists, we sent you a password reset link.",
      })
    }

    const user = users.users.find(u => u.email === email)

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message: "If an account with that email exists, we sent you a password reset link.",
      })
    }

    // Resend password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password/confirm`,
    })

    if (error) {
      console.error("Resend password reset error:", error)
      // Don't reveal specific error details
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      message: "If an account with that email exists, we sent you a password reset link.",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    if (error instanceof Error && error.message === "Rate limit exceeded") {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 })
    }

    console.error("Resend password reset error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 