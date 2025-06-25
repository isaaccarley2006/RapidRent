
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

      console.log('=== AUTH REDIRECT DEBUG ===')
      console.log('Current path:', currentPath)
      console.log('User:', user?.id)
      console.log('Session exists:', !!session)
      console.log('Session access token exists:', !!session?.access_token)

      // If not logged in, redirect to auth (except if already on auth page)
      if (!user || !session) {
        console.log('No user/session, redirecting to auth')
        if (currentPath !== '/auth') {
          navigate('/auth', { replace: true })
        }
        setRedirecting(false)
        return
      }

      // If logged in, check profile completion
      setProfileLoading(true)
      try {
        console.log('Fetching profile for user:', user.id)
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('profile_complete, user_type, full_name, email')
          .eq('id', user.id)
          .maybeSingle()

        console.log('Profile query result:')
        console.log('- Profile data:', profile)
        console.log('- Profile error:', error)
        console.log('- Profile complete:', profile?.profile_complete)
        console.log('- User type:', profile?.user_type)

        // If profile doesn't exist, create one and redirect to onboarding
        if (!profile && !error) {
          console.log('No profile found, creating one...')
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              profile_complete: false
            })
          
          if (insertError) {
            console.error('Error creating profile:', insertError)
          } else {
            console.log('Profile created successfully')
          }
          
          if (currentPath !== '/onboarding') {
            console.log('Redirecting to onboarding (new profile)')
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

        console.log('=== REDIRECT DECISION ===')
        console.log('Profile complete:', isOnboardingComplete)
        console.log('User type:', userType)
        console.log('Current path:', currentPath)

        // Redirect based on profile completion status and user type
        if (!isOnboardingComplete && currentPath !== '/onboarding') {
          console.log('Redirecting to onboarding (incomplete profile)')
          navigate('/onboarding', { replace: true })
        } else if (isOnboardingComplete && (currentPath === '/auth' || currentPath === '/onboarding')) {
          // Redirect completed profiles away from auth/onboarding
          const dashboardPath = userType === 'tenant' ? '/dashboard' : '/dashboard'
          console.log('Redirecting to dashboard:', dashboardPath)
          navigate(dashboardPath, { replace: true })
        } else if (isOnboardingComplete && currentPath === '/') {
          // Also redirect from home page if profile is complete
          const dashboardPath = userType === 'tenant' ? '/dashboard' : '/dashboard'
          console.log('Redirecting from home to dashboard:', dashboardPath)
          navigate(dashboardPath, { replace: true })
        }
        
        console.log('=== REDIRECT COMPLETE ===')
      } catch (error) {
        console.error('Error in auth redirect logic:', error)
        // If any error occurs, redirect to onboarding to be safe
        if (currentPath !== '/onboarding') {
          console.log('Error occurred, redirecting to onboarding as fallback')
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
