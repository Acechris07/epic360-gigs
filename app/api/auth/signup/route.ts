import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { validateEmail, validatePassword } from "@/lib/auth-security"
import { checkRateLimit } from "@/lib/rate-limit"
import { EmailService } from "@/lib/email"
import { z } from "zod"

const signupSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
  fullName: z.string().min(2).max(100),
  isFreelancer: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip ?? "127.0.0.1"
    await checkRateLimit(`auth:${ip}`, 5, 15 * 60 * 1000) // 5 attempts per 15 minutes

    const body = await request.json()

    // Validate input
    const validatedData = signupSchema.parse(body)
    const { email, password, fullName, isFreelancer = false } = validatedData

    // Additional password validation
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: "Password validation failed", details: passwordValidation.errors },
        { status: 400 },
      )
    }

    // Email validation
    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Check if user already exists
    const { data: existingUser } = await supabase.from("profiles").select("email").eq("email", email).single()

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Create user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          full_name: fullName,
          is_freelancer: isFreelancer,
        },
      },
    })

    if (authError) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
    }

    // Create profile
    if (authData.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        is_freelancer: isFreelancer,
        is_client: true,
      })

      if (profileError) {
        console.error("Profile creation error:", profileError)
      }

      // Send welcome email (optional - won't break signup if it fails)
      try {
        await EmailService.sendWelcomeEmail(email, fullName)
      } catch (emailError) {
        console.error("Welcome email failed to send:", emailError)
        // Don't fail the signup process if email fails
      }
    }

    return NextResponse.json({
      message: "Account created successfully. Please check your email to verify your account.",
      user: authData.user,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }

    if (error instanceof Error && error.message === "Rate limit exceeded") {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 })
    }

    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
