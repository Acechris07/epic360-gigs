import { createClient } from "@supabase/supabase-js"
import { authRateLimit } from "./rate-limit"

// Enhanced Supabase client with security configurations
export const createSecureSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: "pkce", // More secure than implicit flow
    },
    global: {
      headers: {
        "X-Client-Info": "epic360-gigs",
      },
    },
  })
}

// Password validation rules
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  // Make special character optional for development
  // if (!/(?=.*[@$!%*?&])/.test(password)) {
  //   errors.push("Password must contain at least one special character")
  // }

  // Check against common passwords
  const commonPasswords = ["password123", "123456789", "qwerty123", "admin123", "welcome123", "password1", "letmein123"]

  if (commonPasswords.some((common) => password.toLowerCase().includes(common.toLowerCase()))) {
    errors.push("Password is too common")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

// Rate limiting for auth attempts
// Note: authRateLimit is now imported from rate-limit.ts
// export const authRateLimit = rateLimit({
//   interval: 15 * 60 * 1000, // 15 minutes
//   uniqueTokenPerInterval: 500,
// })

// Session security
export const generateSecureToken = (): string => {
  return crypto.randomUUID() + "-" + Date.now().toString(36)
}
