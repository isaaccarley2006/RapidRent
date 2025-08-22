import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface ReferenceCheckData {
  id: string
  user_id: string
  full_name: string | null
  email: string | null
  phone: string | null
  date_of_birth: string | null
  current_address: string | null
  previous_address: string | null
  time_at_current_address: string | null
  employment_status: string | null
  employer_name: string | null
  job_title: string | null
  employment_start_date: string | null
  annual_income: number | null
  has_pets: boolean | null
  pet_details: string | null
  is_smoker: boolean | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  emergency_contact_relationship: string | null
  additional_notes: string | null
  status: string
  created_at: string
  updated_at: string
}

export const useTenantReferenceDetails = (tenantId: string) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [referenceData, setReferenceData] = useState<ReferenceCheckData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReferenceDetails = async () => {
    if (!user || !tenantId) return

    try {
      setLoading(true)
      setError(null)

      // First verify agent has access to this tenant
      const { data: accessCheck, error: accessError } = await supabase
        .from('agent_tenant_access')
        .select('id')
        .eq('agent_id', user.id)
        .eq('tenant_id', tenantId)
        .is('revoked_at', null)
        .maybeSingle()

      if (accessError) throw accessError

      if (!accessCheck) {
        throw new Error('Access denied to this tenant data')
      }

      // Get reference check submission data
      const { data: referenceCheck, error: referenceError } = await supabase
        .from('reference_check_submissions')
        .select('*')
        .eq('user_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (referenceError) throw referenceError

      setReferenceData(referenceCheck)
    } catch (error) {
      console.error('Error fetching reference details:', error)
      setError(error instanceof Error ? error.message : 'Failed to load reference details')
      toast({
        title: "Error loading reference details",
        description: "Please try again later.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && tenantId) {
      fetchReferenceDetails()
    }
  }, [user, tenantId])

  return {
    referenceData,
    loading,
    error,
    refetch: fetchReferenceDetails
  }
}