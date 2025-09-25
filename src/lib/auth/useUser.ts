import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface UserProfile {
  id: string
  role?: string | null
}

interface UseUserReturn {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  refresh: () => Promise<void>
}

export const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_type')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return {
        id: data.id,
        role: data.user_type
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  const updateAuthState = (newSession: Session | null) => {
    setSession(newSession)
    setUser(newSession?.user ?? null)
    
    if (newSession?.user) {
      // Debounce profile fetch to avoid multiple calls
      setTimeout(() => {
        fetchProfile(newSession.user.id).then(setProfile)
      }, 200)
    } else {
      setProfile(null)
    }
  }

  const refresh = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      updateAuthState(session)
    } catch (error) {
      console.error('Error refreshing auth state:', error)
    }
  }

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        updateAuthState(session)
        setLoading(false)
      }
    )

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateAuthState(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    profile,
    session,
    loading,
    refresh
  }
}