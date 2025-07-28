import { NextResponse } from "next/server"
import { validatePassword } from "@/lib/auth-security"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    
    const validation = validatePassword(password)
    
    return NextResponse.json({
      isValid: validation.isValid,
      errors: validation.errors,
      passwordLength: password.length,
      hasLowercase: /(?=.*[a-z])/.test(password),
      hasUppercase: /(?=.*[A-Z])/.test(password),
      hasNumber: /(?=.*\d)/.test(password),
      hasSpecial: /(?=.*[@$!%*?&])/.test(password),
    })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
} 