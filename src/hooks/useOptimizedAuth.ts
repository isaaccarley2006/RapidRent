import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

interface CachedProfile {
  id: string
  email: string | null
  full_name: string | null
  user_type: string | null
  profile_complete: boolean
  profile_completion_percentage: number | null
  identity_verified: boolean | null
  employment_verified: boolean | null
  income_verified: boolean | null
  credit_verified: boolean | null
  references_verified: boolean | null
  bank_verified: boolean | null
}

export const useOptimizedAuth = () => {
  const { user, session, loading: authLoading } = useAuth()
  const queryClient = useQueryClient()

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<CachedProfile | null> => {
      if (!user?.id) return null

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          user_type,
          profile_complete,
          profile_completion_percentage,
          identity_verified,
          employment_verified,
          income_verified,
          credit_verified,
          references_verified,
          bank_verified
        `)
        .eq('id', user.id)
        .maybeSingle()

      if (error) throw error
      return data
    },
    enabled: !!user?.id && !authLoading,
    staleTime: 2 * 60 * 1000, // 2 minutes - profiles don't change often
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  })

  const invalidateProfile = () => {
    queryClient.invalidateQueries({ queryKey: ['profile', user?.id] })
  }

  const updateProfileCache = (updates: Partial<CachedProfile>) => {
    if (!user?.id) return

    queryClient.setQueryData(['profile', user.id], (oldData: CachedProfile | null) => {
      if (!oldData) return null
      return { ...oldData, ...updates }
    })
  }

  const createProfile = async (profileData: Partial<CachedProfile>) => {
    if (!user?.id) throw new Error('No authenticated user')

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        profile_complete: false,
        ...profileData
      })
      .select()
      .single()

    if (error) throw error

    // Update cache immediately
    queryClient.setQueryData(['profile', user.id], data)
    return data
  }

  return {
    user,
    session,
    profile,
    loading: authLoading || profileLoading,
    profileError,
    refetchProfile,
    invalidateProfile,
    updateProfileCache,
    createProfile,
    isAuthenticated: !!user && !!session,
    isProfileComplete: profile?.profile_complete || false
  }
}