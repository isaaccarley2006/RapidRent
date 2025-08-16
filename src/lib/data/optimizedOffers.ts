import { supabase } from '@/integrations/supabase/client'

interface OptimizedOfferWithDetails {
  id: string
  offer_price: number
  status: string
  preferred_move_in_date: string | null
  tenant_message: string | null
  message: string | null
  created_at: string
  property_id: string
  tenant_id: string
  renter_id: string
  // Property details
  property_title: string
  property_location: string | null
  property_price: number | null
  // Profile details
  profile_full_name: string | null
  profile_email: string | null
  profile_phone: string | null
  profile_date_of_birth: string | null
  profile_national_insurance_number: string | null
  profile_current_address: string | null
  profile_previous_address: string | null
  profile_time_at_current_address: string | null
  profile_employment_status: string | null
  profile_employer_name: string | null
  profile_employer_address: string | null
  profile_job_title: string | null
  profile_employment_start_date: string | null
  profile_annual_income: number | null
  profile_credit_score: number | null
  profile_bank_name: string | null
  profile_account_holder_name: string | null
  profile_sort_code: string | null
  profile_has_pets: boolean | null
  profile_pet_details: string | null
  profile_is_smoker: boolean | null
  profile_tenant_references: string | null
  profile_additional_notes: string | null
  profile_emergency_contact_name: string | null
  profile_emergency_contact_phone: string | null
  profile_emergency_contact_relationship: string | null
  profile_identity_verified: boolean | null
  profile_employment_verified: boolean | null
  profile_income_verified: boolean | null
  profile_credit_verified: boolean | null
  profile_references_verified: boolean | null
  profile_bank_verified: boolean | null
  profile_completion_percentage: number | null
  profile_current_rental_situation: string | null
}

export const fetchOptimizedOffers = async (
  landlordId: string,
  propertyId?: string,
  limit = 50,
  offset = 0
): Promise<OptimizedOfferWithDetails[]> => {
  try {
    // First get the offers with property join only
    let query = supabase
      .from('offers')
      .select(`
        id,
        offer_price,
        status,
        preferred_move_in_date,
        tenant_message,
        message,
        created_at,
        property_id,
        tenant_id,
        renter_id,
        properties!inner(
          title,
          location,
          price,
          landlord_id
        )
      `)
      .eq('properties.landlord_id', landlordId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (propertyId) {
      query = query.eq('property_id', propertyId)
    }

    const { data: offers, error: offersError } = await query

    if (offersError) throw offersError

    if (!offers || offers.length === 0) {
      return []
    }

    // Get unique tenant IDs for batch profile fetch
    const tenantIds = [...new Set(offers.map(offer => offer.tenant_id))]
    
    // Batch fetch profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        phone,
        date_of_birth,
        national_insurance_number,
        current_address,
        previous_address,
        time_at_current_address,
        employment_status,
        employer_name,
        employer_address,
        job_title,
        employment_start_date,
        annual_income,
        credit_score,
        bank_name,
        account_holder_name,
        sort_code,
        has_pets,
        pet_details,
        is_smoker,
        tenant_references,
        additional_notes,
        emergency_contact_name,
        emergency_contact_phone,
        emergency_contact_relationship,
        identity_verified,
        employment_verified,
        income_verified,
        credit_verified,
        references_verified,
        bank_verified,
        profile_completion_percentage,
        current_rental_situation
      `)
      .in('id', tenantIds)

    if (profilesError) throw profilesError

    // Create a map for quick profile lookup
    const profileMap = new Map()
    profiles?.forEach(profile => {
      profileMap.set(profile.id, profile)
    })

    // Transform the data to flat structure with joined profiles
    return offers.map(offer => {
      const profile = profileMap.get(offer.tenant_id)
      
      return {
        id: offer.id,
        offer_price: offer.offer_price,
        status: offer.status,
        preferred_move_in_date: offer.preferred_move_in_date,
        tenant_message: offer.tenant_message,
        message: offer.message,
        created_at: offer.created_at,
        property_id: offer.property_id,
        tenant_id: offer.tenant_id,
        renter_id: offer.renter_id,
        // Flatten property data
        property_title: offer.properties?.title || '',
        property_location: offer.properties?.location || null,
        property_price: offer.properties?.price || null,
        // Flatten profile data
        profile_full_name: profile?.full_name || null,
        profile_email: profile?.email || null,
        profile_phone: profile?.phone || null,
        profile_date_of_birth: profile?.date_of_birth || null,
        profile_national_insurance_number: profile?.national_insurance_number || null,
        profile_current_address: profile?.current_address || null,
        profile_previous_address: profile?.previous_address || null,
        profile_time_at_current_address: profile?.time_at_current_address || null,
        profile_employment_status: profile?.employment_status || null,
        profile_employer_name: profile?.employer_name || null,
        profile_employer_address: profile?.employer_address || null,
        profile_job_title: profile?.job_title || null,
        profile_employment_start_date: profile?.employment_start_date || null,
        profile_annual_income: profile?.annual_income || null,
        profile_credit_score: profile?.credit_score || null,
        profile_bank_name: profile?.bank_name || null,
        profile_account_holder_name: profile?.account_holder_name || null,
        profile_sort_code: profile?.sort_code || null,
        profile_has_pets: profile?.has_pets || null,
        profile_pet_details: profile?.pet_details || null,
        profile_is_smoker: profile?.is_smoker || null,
        profile_tenant_references: profile?.tenant_references || null,
        profile_additional_notes: profile?.additional_notes || null,
        profile_emergency_contact_name: profile?.emergency_contact_name || null,
        profile_emergency_contact_phone: profile?.emergency_contact_phone || null,
        profile_emergency_contact_relationship: profile?.emergency_contact_relationship || null,
        profile_identity_verified: profile?.identity_verified || null,
        profile_employment_verified: profile?.employment_verified || null,
        profile_income_verified: profile?.income_verified || null,
        profile_credit_verified: profile?.credit_verified || null,
        profile_references_verified: profile?.references_verified || null,
        profile_bank_verified: profile?.bank_verified || null,
        profile_completion_percentage: profile?.profile_completion_percentage || null,
        profile_current_rental_situation: profile?.current_rental_situation || null
      }
    })
  } catch (error) {
    console.error('Error fetching optimized offers:', error)
    throw error
  }
}

export const batchUpdateOffers = async (updates: Array<{ id: string; status: string }>) => {
  try {
    const promises = updates.map(update =>
      supabase
        .from('offers')
        .update({ status: update.status, updated_at: new Date().toISOString() })
        .eq('id', update.id)
    )

    const results = await Promise.all(promises)
    
    // Check for errors
    const errors = results.filter(result => result.error)
    if (errors.length > 0) {
      throw new Error(`Failed to update ${errors.length} offers`)
    }

    return results.map(result => result.data).filter(Boolean)
  } catch (error) {
    console.error('Error batch updating offers:', error)
    throw error
  }
}