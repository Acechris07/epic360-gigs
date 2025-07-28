import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { validateEmail } from "@/lib/auth-security"
import { checkRateLimit } from "@/lib/rate-limit"
import { EmailService } from "@/lib/email"
import { z } from "zod"

const resetSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip ?? "127.0.0.1"
    await checkRateLimit(`auth:${ip}`, 2, 15 * 60 * 1000) // 2 attempts per 15 minutes

    const body = await request.json()
    const { email } = resetSchema.parse(body)

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password/confirm`,
    })

    if (error) {
      console.error("Password reset error:", error)
      // Don't reveal if email exists or not
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      message: "If an account with that email exists, we sent you a password reset link.",
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Rate limit exceeded") {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 })
    }

    console.error("Password reset error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
