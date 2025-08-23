import React, { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useOptimizedAuth } from '@/hooks/useOptimizedAuth'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Home } from 'lucide-react'
import { OfferCard } from './OfferCard'
import { fetchOptimizedOffers, batchUpdateOffers } from '@/lib/data/optimizedOffers'
import { useOptimizedOffersRealtime } from '@/hooks/useOptimizedOffersRealtime'
import { supabase } from '@/lib/supabase'

interface OptimizedOffersManagerProps {
  propertyId?: string
  limit?: number
}

export const OptimizedOffersManager: React.FC<OptimizedOffersManagerProps> = ({ 
  propertyId, 
  limit = 25 
}) => {
  const { user } = useOptimizedAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedOffer, setSelectedOffer] = useState<any>(null)

  const offersQueryKey = ['offers', user?.id, propertyId, limit]

  const {
    data: offersData = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: offersQueryKey,
    queryFn: () => fetchOptimizedOffers(user!.id, propertyId, limit),
    enabled: !!user?.id,
    staleTime: 30 * 1000, // 30 seconds - offers change frequently
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })

  // Transform optimized data back to expected format for OfferCard
  const offers = useMemo(() => {
    return offersData.map(offer => ({
      id: offer.id,
      offer_price: offer.offer_price,
      status: offer.status,
      preferred_move_in_date: offer.preferred_move_in_date,
      tenant_message: offer.tenant_message || offer.message,
      created_at: offer.created_at,
      properties: {
        title: offer.property_title,
        location: offer.property_location,
        price: offer.property_price
      },
      profiles: {
        full_name: offer.profile_full_name,
        email: offer.profile_email,
        phone: offer.profile_phone,
        date_of_birth: offer.profile_date_of_birth,
        national_insurance_number: offer.profile_national_insurance_number,
        current_address: offer.profile_current_address,
        previous_address: offer.profile_previous_address,
        time_at_current_address: offer.profile_time_at_current_address,
        employment_status: offer.profile_employment_status,
        employer_name: offer.profile_employer_name,
        employer_address: offer.profile_employer_address,
        job_title: offer.profile_job_title,
        employment_start_date: offer.profile_employment_start_date,
        annual_income: offer.profile_annual_income,
        credit_score: offer.profile_credit_score,
        bank_name: offer.profile_bank_name,
        account_holder_name: offer.profile_account_holder_name,
        sort_code: offer.profile_sort_code,
        has_pets: offer.profile_has_pets,
        pet_details: offer.profile_pet_details,
        is_smoker: offer.profile_is_smoker,
        tenant_references: offer.profile_tenant_references,
        additional_notes: offer.profile_additional_notes,
        emergency_contact_name: offer.profile_emergency_contact_name,
        emergency_contact_phone: offer.profile_emergency_contact_phone,
        emergency_contact_relationship: offer.profile_emergency_contact_relationship,
        identity_verified: offer.profile_identity_verified,
        employment_verified: offer.profile_employment_verified,
        income_verified: offer.profile_income_verified,
        credit_verified: offer.profile_credit_verified,
        references_verified: offer.profile_references_verified,
        bank_verified: offer.profile_bank_verified,
        profile_completion_percentage: offer.profile_completion_percentage,
        current_rental_situation: offer.profile_current_rental_situation
      }
    }))
  }, [offersData])

  const updateOfferMutation = useMutation({
    mutationFn: async ({ offerId, status }: { offerId: string; status: 'shortlisted' | 'accepted' }) => {
      const { error } = await supabase
        .from('offers')
        .update({ status })
        .eq('id', offerId)

      if (error) throw error
    },
    onSuccess: (_, { status }) => {
      toast({
        title: `Offer ${status}`,
        description: `The offer has been ${status} successfully.`
      })
      // Invalidate and refetch offers
      queryClient.invalidateQueries({ queryKey: offersQueryKey })
    },
    onError: (error) => {
      console.error('Error updating offer:', error)
      toast({
        title: "Error updating offer",
        description: "Please try again.",
        variant: "destructive"
      })
    }
  })

  const handleUpdateStatus = useCallback((offerId: string, status: 'shortlisted' | 'accepted') => {
    updateOfferMutation.mutate({ offerId, status })
  }, [updateOfferMutation])

  // Import optimized realtime hook
  useOptimizedOffersRealtime({
    userId: user?.id,
    propertyId,
    enabled: !!user?.id
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-red-600 mb-4">Error loading offers</p>
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Retry
          </button>
        </CardContent>
      </Card>
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
        <CardTitle>Property Offers ({offers.length})</CardTitle>
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
              updating={updateOfferMutation.isPending ? offer.id : null}
              onUpdateStatus={handleUpdateStatus}
              onSelectOffer={setSelectedOffer}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}