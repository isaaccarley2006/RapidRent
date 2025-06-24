
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'

const supabaseUrl = "https://jerfstkniwyxnsnimcrv.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplcmZzdGtuaXd5eG5zbmltY3J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NjIwOTAsImV4cCI6MjA2NjMzODA5MH0.f8WGzacMcFXvZV_sMOjv2s1o8OoidFxUKgdgij0xUkE"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})
