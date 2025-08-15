
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export const useAuthRedirect = () => {
  const { user, session, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [profileLoading, setProfileLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    if (loading) return

    const handleRedirect = async () => {
      const currentPath = location.pathname
      setRedirecting(true)

      // If not logged in, redirect to auth (except if already on auth page)
      if (!user || !session) {
        if (currentPath !== '/auth') {
          navigate('/auth', { replace: true })
        }
        setRedirecting(false)
        return
      }

      // User is authenticated - cache profile fetch to avoid repeated calls
      if (profileLoading) return
      
      setProfileLoading(true)
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('profile_complete, user_type, full_name, email')
          .eq('id', user.id)
          .maybeSingle()

        // If profile doesn't exist, create one and redirect to onboarding
        if (!profile && !error) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              profile_complete: false
            })
          
          if (insertError) {
            console.error('Error creating profile:', insertError)
          }
          
          if (currentPath !== '/onboarding') {
            navigate('/onboarding', { replace: true })
          }
          setProfileLoading(false)
          setRedirecting(false)
          return
        }

        if (error) {
          console.error('Profile fetch error:', error)
          throw error
        }

        const isOnboardingComplete = profile?.profile_complete || false
        const userType = profile?.user_type

        // Redirect based on profile completion status and user type
        if (!isOnboardingComplete && currentPath !== '/onboarding') {
          navigate('/onboarding', { replace: true })
        } else if (isOnboardingComplete) {
          // Use generic dashboard path for simplicity
          if (currentPath === '/auth' || currentPath === '/onboarding' || currentPath === '/') {
            navigate('/dashboard', { replace: true })
          }
        }
      } catch (error) {
        console.error('Error in auth redirect logic:', error)
        // If any error occurs, redirect to onboarding to be safe
        if (currentPath !== '/onboarding') {
          navigate('/onboarding', { replace: true })
        }
      } finally {
        setProfileLoading(false)
        setRedirecting(false)
      }
    }

    // Debounce the redirect to prevent rapid successive calls
    const timeoutId = setTimeout(handleRedirect, 100)
    return () => clearTimeout(timeoutId)
  }, [user, session, loading, navigate, location.pathname])

  return {
    loading: loading || profileLoading || redirecting,
    user,
    session
  }
}
