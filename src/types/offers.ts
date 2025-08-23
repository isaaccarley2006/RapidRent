export type OfferStatus = 'pending' | 'shortlisted' | 'accepted'

export interface OfferRow {
  id: string
  listing_id: string
  renter_id: string
  monthly_rent: number | null
  move_in_date: string | null
  term_months: number | null
  occupants: number | null
  pets: boolean | null
  notes: string | null
  status: OfferStatus
  created_at: string
  // Hydrated via joins
  renter?: { name?: string | null; email?: string | null }
  property?: { title: string; location?: string | null; price?: number | null }
}

export interface LandlordListing {
  id: string
  title: string
  location: string | null
  price: number | null
  status: string
}

export interface OfferComparisonData {
  id: string
  renter_name: string | null
  monthly_rent: number | null
  move_in_date: string | null
  term_months: number | null
  occupants: number | null
  pets: boolean | null
  notes: string | null
  created_at: string
  property_title: string
}