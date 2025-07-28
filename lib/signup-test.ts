export async function testSignupReadiness() {
  const checks = {
    supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    siteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
  }

  return {
    ready: Object.values(checks).every(Boolean),
    checks,
    missing: Object.entries(checks)
      .filter(([_, value]) => !value)
      .map(([key]) => key),
  }
}
