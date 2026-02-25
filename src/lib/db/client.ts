import { createClient, type SupabaseClient } from '@supabase/supabase-js'

function getUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  return url
}

function getAnonKey() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
  return key
}

// Client-side Supabase client (uses anon key) — lazy singleton
let _supabase: SupabaseClient | null = null

export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(getUrl(), getAnonKey())
  }
  return _supabase
}

// Backwards-compatible named export (getter so it's lazy)
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

// Server-side Supabase client (uses service role key for admin operations)
export function createServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  return createClient(getUrl(), serviceRoleKey, {
    auth: { persistSession: false },
  })
}
