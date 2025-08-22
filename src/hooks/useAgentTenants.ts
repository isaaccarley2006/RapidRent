import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface TenantData {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  current_address: string | null
  verification_status: 'verified' | 'pending' | 'incomplete'
  identity_verified: boolean | null
  employment_verified: boolean | null
  income_verified: boolean | null
  credit_verified: boolean | null
  references_verified: boolean | null
  profile_completion_percentage: number | null
  granted_at: string
  annual_income: number | null
  employer_name: string | null
}

export const useAgentTenants = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [tenants, setTenants] = useState<TenantData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAgentTenants = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // First get all tenant access grants for this agent
      const { data: accessGrants, error: accessError } = await supabase
        .from('agent_tenant_access')
        .select('tenant_id, granted_at')
        .eq('agent_id', user.id)
        .is('revoked_at', null)

      if (accessError) throw accessError

      if (!accessGrants || accessGrants.length === 0) {
        setTenants([])
        return
      }

      // Get tenant profile data for all granted tenants
      const tenantIds = accessGrants.map(grant => grant.tenant_id)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          phone,
          current_address,
          identity_verified,
          employment_verified,
          income_verified,
          credit_verified,
          references_verified,
          profile_completion_percentage,
          annual_income,
          employer_name
        `)
        .in('id', tenantIds)

      if (profilesError) throw profilesError

      // Combine access grants with profile data
      const enrichedTenants: TenantData[] = profiles?.map(profile => {
        const access = accessGrants.find(grant => grant.tenant_id === profile.id)
        
        // Determine verification status
        const verifiedCount = [
          profile.identity_verified,
          profile.employment_verified,
          profile.income_verified,
          profile.credit_verified,
          profile.references_verified
        ].filter(Boolean).length

        let verification_status: 'verified' | 'pending' | 'incomplete'
        if (verifiedCount === 5) {
          verification_status = 'verified'
        } else if (verifiedCount >= 3) {
          verification_status = 'pending'
        } else {
          verification_status = 'incomplete'
        }

        return {
          ...profile,
          verification_status,
          granted_at: access?.granted_at || new Date().toISOString()
        }
      }) || []

      setTenants(enrichedTenants)
    } catch (error) {
      console.error('Error fetching agent tenants:', error)
      setError('Failed to load tenant data')
      toast({
        title: "Error loading tenant data",
        description: "Please try refreshing the page.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchAgentTenants()
    }
  }, [user])

  return {
    tenants,
    loading,
    error,
    refetch: fetchAgentTenants
  }
}