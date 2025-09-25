
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useOptimizedAuth } from './useOptimizedAuth'

export const useAuthRedirect = () => {
  const { user, session, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading, createProfile } = useOptimizedAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    if (authLoading || profileLoading) return

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

      try {
        // If profile doesn't exist, create one and redirect to dashboard
        if (!profile) {
          await createProfile({
            email: user.email,
            profile_complete: true
          })
          
          if (currentPath !== '/dashboard') {
            navigate('/dashboard', { replace: true })
          }
          setRedirecting(false)
          return
        }

        // Always redirect authenticated users to dashboard
        if (currentPath === '/auth' || currentPath === '/onboarding' || currentPath === '/') {
          navigate('/dashboard', { replace: true })
        }
      } catch (error) {
        console.error('Error in auth redirect logic:', error)
        // If any error occurs, redirect to onboarding to be safe
        if (currentPath !== '/onboarding') {
          navigate('/onboarding', { replace: true })
        }
      } finally {
        setRedirecting(false)
      }
    }

    // Debounce the redirect to prevent rapid successive calls
    const timeoutId = setTimeout(handleRedirect, 100)
    return () => clearTimeout(timeoutId)
  }, [user, session, authLoading, profileLoading, profile, navigate, location.pathname, createProfile])

  return {
    loading: authLoading || profileLoading || redirecting,
    user,
    session
  }
}
