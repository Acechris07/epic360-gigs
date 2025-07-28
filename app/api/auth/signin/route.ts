import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { checkRateLimit } from "@/lib/rate-limit"
import { z } from "zod"

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip ?? "127.0.0.1"
    await checkRateLimit(`auth:${ip}`, 3, 15 * 60 * 1000) // 3 attempts per 15 minutes

    const body = await request.json()
    const { email, password } = signinSchema.parse(body)

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Log failed attempts for monitoring
      console.warn(`Failed signin attempt for ${email} from ${ip}`)

      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Log successful signin
    console.info(`Successful signin for ${email}`)

    return NextResponse.json({
      message: "Signed in successfully",
      user: data.user,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    if (error instanceof Error && error.message === "Rate limit exceeded") {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 })
    }

    console.error("Signin error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
