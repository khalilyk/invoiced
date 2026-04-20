import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'placeholder'

if (!import.meta.env.VITE_SUPABASE_URL) {
  console.warn('[supabase] VITE_SUPABASE_URL is not set. Add credentials to .env.local.')
}

// Once you run `npx supabase gen types typescript --project-id [ID] > src/types/database.ts`
// swap to: createClient<Database>(supabaseUrl, supabaseAnonKey)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
