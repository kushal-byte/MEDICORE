import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isConfigured = Boolean(url && key && !url.includes('your-project-ref'))

if (!isConfigured) {
  // Helps the dev notice missing credentials instead of silent failure.
  console.warn('[MediCore] Supabase env vars missing. Copy .env.example -> .env and fill in credentials.')
}

export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  key || 'placeholder-anon-key'
)
