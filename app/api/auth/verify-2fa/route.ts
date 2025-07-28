import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { z } from "zod"

const verify2FASchema = z.object({
  token: z.string().length(6).regex(/^\d+$/),
  factorId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, factorId } = verify2FASchema.parse(body)

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data, error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: factorId, // This would come from the challenge creation
      code: token,
    })

    if (error) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 401 })
    }

    return NextResponse.json({
      message: "2FA verified successfully",
      session: data,
    })
  } catch (error) {
    console.error("2FA verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
