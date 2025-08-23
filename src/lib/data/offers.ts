import { supabase } from '@/integrations/supabase/client'
import type { OfferRow, OfferStatus, LandlordListing } from '@/types/offers'

export const fetchLandlordListings = async (landlordId: string): Promise<LandlordListing[]> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('id, title, location, price, status')
      .eq('landlord_id', landlordId)
      .eq('status', 'listed')
      .order('title', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching landlord listings:', error)
    throw error
  }
}

export const fetchOffersByLandlord = async (
  landlordId: string, 
  options: { listingId?: string; limit?: number; from?: number } = {}
): Promise<OfferRow[]> => {
  try {
    const { listingId, limit = 25, from = 0 } = options
    
    let query = supabase
      .from('offers')
      .select(`
        *,
        properties!inner(title, location, price, landlord_id),
        profiles(full_name, email)
      `)
      .eq('properties.landlord_id', landlordId)
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1)

    if (listingId) {
      query = query.eq('listing_id', listingId)
    }

    const { data, error } = await query

    if (error) throw error

    return (data || []).map(offer => ({
      id: offer.id,
      listing_id: offer.listing_id,
      renter_id: offer.renter_id,
      monthly_rent: offer.offer_price,
      move_in_date: offer.preferred_move_in_date,
      term_months: null, // Not in current schema
      occupants: null, // Not in current schema
      pets: null, // Not in current schema
      notes: offer.message || offer.tenant_message,
      status: offer.status === 'submitted' ? 'pending' : offer.status as OfferStatus,
      created_at: offer.created_at,
      renter: offer.profiles ? {
        name: offer.profiles.full_name,
        email: offer.profiles.email
      } : undefined,
      property: offer.properties ? {
        title: offer.properties.title,
        location: offer.properties.location,
        price: offer.properties.price
      } : undefined
    }))
  } catch (error) {
    console.error('Error fetching offers by landlord:', error)
    throw error
  }
}

export const updateOfferStatus = async (offerId: string, status: OfferStatus): Promise<OfferRow> => {
  try {
    const { data, error } = await supabase
      .from('offers')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', offerId)
      .select(`
        *,
        properties(title, location, price),
        profiles(full_name, email)
      `)
      .single()

    if (error) throw error

    return {
      id: data.id,
      listing_id: data.listing_id,
      renter_id: data.renter_id,
      monthly_rent: data.offer_price,
      move_in_date: data.preferred_move_in_date,
      term_months: null, // Not in current schema
      occupants: null, // Not in current schema
      pets: null, // Not in current schema
      notes: data.message || data.tenant_message,
      status: data.status === 'submitted' ? 'pending' : data.status as OfferStatus,
      created_at: data.created_at,
      renter: data.profiles ? {
        name: data.profiles.full_name,
        email: data.profiles.email
      } : undefined,
      property: data.properties ? {
        title: data.properties.title,
        location: data.properties.location,
        price: data.properties.price
      } : undefined
    }
  } catch (error) {
    console.error('Error updating offer status:', error)
    throw error
  }
}