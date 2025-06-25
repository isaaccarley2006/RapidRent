
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'

const supabaseUrl = "https://jerfstkniwyxnsnimcrv.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplcmZzdGtuaXd5eG5zbmltY3J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NjIwOTAsImV4cCI6MjA2NjMzODA5MH0.f8WGzacMcFXvZV_sMOjv2s1o8OoidFxUKgdgij0xUkE"

console.log('Initializing Supabase client with auth config:')
console.log('- persistSession: true')
console.log('- autoRefreshToken: true')
console.log('- detectSessionInUrl: true')

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// Add session state logging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('=== AUTH STATE CHANGE ===')
  console.log('Event:', event)
  console.log('Session exists:', !!session)
  console.log('User ID:', session?.user?.id)
  console.log('Access token exists:', !!session?.access_token)
  console.log('==========================')
})
