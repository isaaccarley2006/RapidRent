import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { TenantProfile, TenantReference } from '@/types/profile'

export const useProfile = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<TenantProfile | null>(null)
  const [references, setReferences] = useState<TenantReference[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<TenantProfile>>({})

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchReferences()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setProfile(data)
        setFormData(data)
      } else {
        // Create initial profile
        const initialProfile = {
          id: user.id,
          email: user.email,
          user_type: 'tenant'
        }
        setFormData(initialProfile)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: "Error loading profile",
        description: "Please try refreshing the page.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchReferences = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('tenant_references')
        .select('*')
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReferences(data || [])
    } catch (error) {
      console.error('Error fetching references:', error)
    }
  }

  const calculateCompletion = (data: Partial<TenantProfile>) => {
    const fields = [
      'full_name', 'phone', 'date_of_birth', 'current_address',
      'employment_status', 'employer_name', 'job_title', 'annual_income',
      'bank_name', 'account_holder_name'
    ]
    
    const completed = fields.filter(field => {
      const value = data[field as keyof TenantProfile]
      return value !== null && value !== undefined && value !== ''
    }).length
    
    return Math.round((completed / fields.length) * 100)
  }

  const saveProfile = async () => {
    if (!user) return

    setSaving(true)
    try {
      const completionPercentage = calculateCompletion(formData)
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          ...formData,
          id: user.id,
          user_type: 'tenant',
          profile_completion_percentage: completionPercentage,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast({
        title: "Profile updated successfully",
        description: "Your tenant profile has been saved."
      })

      fetchProfile()
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: "Error saving profile",
        description: "Please try again.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const addReference = async (referenceData: { 
    reference_type: string, 
    contact_name: string,
    contact_email?: string,
    contact_phone?: string,
    company_name?: string,
    relationship?: string,
    reference_period?: string,
    notes?: string
  }) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('tenant_references')
        .insert({
          ...referenceData,
          tenant_id: user.id
        })

      if (error) throw error

      toast({
        title: "Reference added",
        description: "Your reference has been added successfully."
      })

      fetchReferences()
    } catch (error) {
      console.error('Error adding reference:', error)
      toast({
        title: "Error adding reference",
        description: "Please try again.",
        variant: "destructive"
      })
    }
  }

  return {
    profile,
    references,
    loading,
    saving,
    formData,
    setFormData,
    saveProfile,
    addReference,
    fetchProfile,
    fetchReferences
  }
}