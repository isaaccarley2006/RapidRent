import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { TenantProfile } from '@/types/profile'
import { RenterProfileWizardData } from '@/types/renter'

export const useRenterProfile = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<TenantProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') throw error

      setProfile(data)
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

  const saveWizardData = async (wizardData: RenterProfileWizardData) => {
    if (!user) return false

    setSaving(true)
    try {
      const profileData = {
        id: user.id,
        email: user.email,
        user_type: 'tenant',
        full_name: wizardData.full_name || null,
        phone: wizardData.phone || null,
        date_of_birth: wizardData.date_of_birth || null,
        current_address: wizardData.current_address || null,
        time_at_current_address: wizardData.time_at_current_address || null,
        employment_status: wizardData.employment_status || null,
        annual_income: wizardData.annual_income || null,
        employer_name: wizardData.employer_name || null,
        job_title: wizardData.job_title || null,
        employment_start_date: wizardData.employment_start_date || null,
        has_pets: wizardData.has_pets || null,
        pet_details: wizardData.pet_details || null,
        is_smoker: wizardData.is_smoker || null,
        emergency_contact_name: wizardData.emergency_contact_name || null,
        emergency_contact_phone: wizardData.emergency_contact_phone || null,
        emergency_contact_relationship: wizardData.emergency_contact_relationship || null,
        profile_completion_percentage: 90, // High completion after wizard
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData)

      if (error) throw error

      toast({
        title: "Profile saved successfully",
        description: "Your renter profile is now complete."
      })

      await fetchProfile()
      return true
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: "Error saving profile",
        description: "Please try again.",
        variant: "destructive"
      })
      return false
    } finally {
      setSaving(false)
    }
  }

  const isProfileComplete = () => {
    if (!profile) return false
    return profile.profile_completion_percentage >= 80
  }

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  return {
    profile,
    loading,
    saving,
    saveWizardData,
    isProfileComplete,
    fetchProfile
  }
}