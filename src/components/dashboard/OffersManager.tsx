import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Home } from 'lucide-react'
import { OfferCard } from './OfferCard'

interface OfferWithDetails {
  id: string
  offer_price: number
  status: string
  preferred_move_in_date: string | null
  created_at: string
  properties: {
    title: string
    location: string | null
    price: number | null
  } | null
  profiles: {
    full_name: string | null
    email: string | null
    phone: string | null
    date_of_birth: string | null
    national_insurance_number: string | null
    current_address: string | null
    previous_address: string | null
    time_at_current_address: string | null
    employment_status: string | null
    employer_name: string | null
    employer_address: string | null
    job_title: string | null
    employment_start_date: string | null
    annual_income: number | null
    credit_score: number | null
    bank_name: string | null
    account_holder_name: string | null
    sort_code: string | null
    has_pets: boolean | null
    pet_details: string | null
    is_smoker: boolean | null
    tenant_references: string | null
    additional_notes: string | null
    emergency_contact_name: string | null
    emergency_contact_phone: string | null
    emergency_contact_relationship: string | null
    identity_verified: boolean | null
    employment_verified: boolean | null
    income_verified: boolean | null
    credit_verified: boolean | null
    references_verified: boolean | null
    bank_verified: boolean | null
    profile_completion_percentage: number | null
    current_rental_situation: string | null
  } | null
}

interface OffersManagerProps {
  propertyId?: string
}

export const OffersManager: React.FC<OffersManagerProps> = ({ propertyId }) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [offers, setOffers] = useState<OfferWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOffer, setSelectedOffer] = useState<OfferWithDetails | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchOffers()
    
    // Set up real-time subscription for offers
    const setupRealtimeSubscription = async () => {
      if (!user) return

      // Get landlord's property IDs for filtering
      const { data: properties } = await supabase
        .from('properties')
        .select('id')
        .eq('landlord_id', user.id)

      if (!properties || properties.length === 0) return

      const propertyIds = properties.map(p => p.id)

      const channel = supabase
        .channel('offers-changes')
        .on(
          'postgres_changes',
          {
            event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
            schema: 'public',
            table: 'offers',
            filter: `property_id=in.(${propertyIds.join(',')})`
          },
          () => {
            // Refetch offers when any change occurs
            fetchOffers()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }

    const cleanup = setupRealtimeSubscription()
    
    return () => {
      cleanup.then(fn => fn && fn())
    }
  }, [user, propertyId])

  const fetchOffers = async () => {
    if (!user) return

    try {
      let propertyIds: string[] = []
      
      if (propertyId) {
        propertyIds = [propertyId]
      } else {
        // For dashboard view, get offers for all landlord's properties
        const { data: properties } = await supabase
          .from('properties')
          .select('id')
          .eq('landlord_id', user.id)

        if (properties && properties.length > 0) {
          propertyIds = properties.map(p => p.id)
        }
      }

      if (propertyIds.length === 0) {
        setOffers([])
        return
      }

      // Fetch offers without joins first
      const { data: offersData, error: offersError } = await supabase
        .from('offers')
        .select('*')
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false })

      if (offersError) throw offersError

      // Manually fetch related data for each offer
      const offersWithDetails = await Promise.all(
        (offersData || []).map(async (offer) => {
          // Fetch property details
          const { data: propertyData } = await supabase
            .from('properties')
            .select('title, location, price')
            .eq('id', offer.property_id)
            .single()

          // Fetch tenant profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select(`
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
            .eq('id', offer.tenant_id)
            .single()

          return {
            ...offer,
            properties: propertyData,
            profiles: profileData
          }
        })
      )

      setOffers(offersWithDetails)
    } catch (error) {
      console.error('Error fetching offers:', error)
      toast({
        title: "Error loading offers",
        description: "Please try refreshing the page.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (offerId: string, status: 'accepted' | 'rejected') => {
    setUpdating(offerId)

    try {
      const { error } = await supabase
        .from('offers')
        .update({ status })
        .eq('id', offerId)

      if (error) throw error

      toast({
        title: `Offer ${status}`,
        description: `The offer has been ${status} successfully.`
      })

      fetchOffers()
    } catch (error) {
      console.error('Error updating offer:', error)
      toast({
        title: "Error updating offer",
        description: "Please try again.",
        variant: "destructive"
      })
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (offers.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No offers yet</h3>
          <p className="text-gray-500">
            {propertyId ? 'This property hasn\'t received any offers yet.' : 'None of your properties have received offers yet.'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Offers</CardTitle>
        <CardDescription>
          {propertyId ? 'Manage offers for this property' : 'Manage all offers across your properties'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              updating={updating}
              onUpdateStatus={handleUpdateStatus}
              onSelectOffer={setSelectedOffer}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}