import { createClient } from '@supabase/supabase-js'

// Service-role client — bypasses RLS. NEVER import this in client components.
// Only use in API routes and server actions where the caller is already trusted.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
