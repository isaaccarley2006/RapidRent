
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

      // If logged in, check profile completion
      setProfileLoading(true)
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('profile_complete')
          .eq('id', user.id)
          .single()

        const isOnboardingComplete = profile?.profile_complete || false

        // Redirect based on profile completion status
        if (!isOnboardingComplete && currentPath !== '/onboarding') {
          navigate('/onboarding', { replace: true })
        } else if (isOnboardingComplete && (currentPath === '/auth' || currentPath === '/onboarding')) {
          navigate('/dashboard', { replace: true })
        }
      } catch (error) {
        console.error('Error checking profile:', error)
        // If profile doesn't exist, redirect to onboarding
        if (currentPath !== '/onboarding') {
          navigate('/onboarding', { replace: true })
        }
      } finally {
        setProfileLoading(false)
        setRedirecting(false)
      }
    }

    handleRedirect()
  }, [user, session, loading, navigate, location.pathname])

  return {
    loading: loading || profileLoading || redirecting,
    user,
    session
  }
}
