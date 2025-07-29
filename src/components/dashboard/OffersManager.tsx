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
  tenant_message: string | null
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
    employment_status: string | null
    annual_income: number | null
    current_rental_situation: string | null
    has_pets: boolean | null
    pet_details: string | null
    is_smoker: boolean | null
    tenant_references: string | null
    additional_notes: string | null
    credit_score: number | null
    identity_verified: boolean | null
    employment_verified: boolean | null
    income_verified: boolean | null
    credit_verified: boolean | null
    references_verified: boolean | null
    bank_verified: boolean | null
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
      let query = supabase
        .from('offers')
        .select(`
          *,
          properties (
            title,
            location,
            price
          ),
          profiles (
            full_name,
            email,
            phone,
            employment_status,
            annual_income,
            current_rental_situation,
            has_pets,
            pet_details,
            is_smoker,
            tenant_references,
            additional_notes,
            credit_score,
            identity_verified,
            employment_verified,
            income_verified,
            credit_verified,
            references_verified,
            bank_verified
          )
        `)
        .order('created_at', { ascending: false })

      if (propertyId) {
        query = query.eq('property_id', propertyId)
      } else {
        // For dashboard view, get offers for all landlord's properties
        const { data: properties } = await supabase
          .from('properties')
          .select('id')
          .eq('landlord_id', user.id)

        if (properties && properties.length > 0) {
          const propertyIds = properties.map(p => p.id)
          query = query.in('property_id', propertyIds)
        }
      }

      const { data, error } = await query

      if (error) throw error
      setOffers((data as any[]) || [])
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