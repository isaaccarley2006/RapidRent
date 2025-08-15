
import React, { useEffect, useState } from 'react'
import { GlobalNavigation } from './GlobalNavigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export const NavigationWrapper: React.FC = () => {
  const { user } = useAuth()
  const [userType, setUserType] = useState<'tenant' | 'landlord' | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setUserType(undefined)
      setLoading(false)
      return
    }

    // Debounce the profile fetch to avoid multiple calls
    const timeoutId = setTimeout(async () => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .maybeSingle()

        setUserType(profile?.user_type as 'tenant' | 'landlord' | undefined)
      } catch (error) {
        console.error('Error fetching user type:', error)
      } finally {
        setLoading(false)
      }
    }, 100) // Small delay to debounce

    return () => clearTimeout(timeoutId)
  }, [user])

  if (loading && user) {
    return (
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-bold text-text-primary">
              Rent<span className="text-primary">View</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return <GlobalNavigation userType={userType} />
}
