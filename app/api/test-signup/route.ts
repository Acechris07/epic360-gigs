import { NextResponse } from "next/server"
import { testSignupReadiness } from "@/lib/signup-test"

export async function GET() {
  try {
    const status = await testSignupReadiness()

    return NextResponse.json({
      canSignup: status.ready,
      status: status.checks,
      missing: status.missing,
      message: status.ready ? "✅ Users can sign up!" : `❌ Missing: ${status.missing.join(", ")}`,
    })
  } catch (error) {
    return NextResponse.json(
      {
        canSignup: false,
        error: "Configuration check failed",
      },
      { status: 500 },
    )
  }
}
