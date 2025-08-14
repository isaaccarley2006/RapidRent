import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { AppLayout } from '@/components/layouts/AppLayout'
import { SEOHead } from '@/components/common/SEOHead'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { OffersTable } from '@/components/landlord/OffersTable'
import { OfferCompareDrawer } from '@/components/landlord/OfferCompareDrawer'
import { ListingFilter } from '@/components/landlord/ListingFilter'
import { fetchLandlordListings, fetchOffersByLandlord, updateOfferStatus } from '@/lib/data/offers'
import { analyticsEvents } from '@/lib/analytics'
import type { OfferRow, OfferStatus, LandlordListing } from '@/types/offers'

const LandlordOffers: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()

  // State
  const [offers, setOffers] = useState<OfferRow[]>([])
  const [listings, setListings] = useState<LandlordListing[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingOffers, setUpdatingOffers] = useState<string[]>([])
  const [selectedOffers, setSelectedOffers] = useState<string[]>([])
  const [compareDrawerOpen, setCompareDrawerOpen] = useState(false)

  // URL state
  const selectedListingId = searchParams.get('listing')
  const compareIds = searchParams.get('compare')?.split(',').filter(Boolean) || []

  // Initialize selected offers from URL
  useEffect(() => {
    if (compareIds.length > 0) {
      setSelectedOffers(compareIds)
      if (compareIds.length > 0) {
        setCompareDrawerOpen(true)
      }
    }
  }, [])

  // Load data
  useEffect(() => {
    if (!user?.id) return
    loadData()
    analyticsEvents.landlordInboxViewed()
  }, [user?.id, selectedListingId])

  const loadData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const [listingsData, offersData] = await Promise.all([
        fetchLandlordListings(user.id),
        fetchOffersByLandlord(user.id, { 
          listingId: selectedListingId || undefined 
        })
      ])
      
      setListings(listingsData)
      setOffers(offersData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: 'Error loading offers',
        description: 'Failed to load your offers. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleListingFilter = (listingId: string | null) => {
    const newParams = new URLSearchParams(searchParams)
    if (listingId) {
      newParams.set('listing', listingId)
    } else {
      newParams.delete('listing')
    }
    setSearchParams(newParams)
  }

  const handleOfferSelect = (offerId: string, selected: boolean) => {
    let newSelected: string[]
    
    if (selected) {
      if (selectedOffers.length >= 3) {
        toast({
          title: 'Maximum selection reached',
          description: 'You can compare up to 3 offers at a time.',
          variant: 'destructive'
        })
        return
      }
      newSelected = [...selectedOffers, offerId]
    } else {
      newSelected = selectedOffers.filter(id => id !== offerId)
    }
    
    setSelectedOffers(newSelected)
    
    // Update URL
    const newParams = new URLSearchParams(searchParams)
    if (newSelected.length > 0) {
      newParams.set('compare', newSelected.join(','))
    } else {
      newParams.delete('compare')
    }
    setSearchParams(newParams)
  }

  const handleStatusChange = async (offerId: string, newStatus: OfferStatus) => {
    const currentOffer = offers.find(o => o.id === offerId)
    if (!currentOffer) return

    const oldStatus = currentOffer.status

    // Optimistic update
    setOffers(prev => prev.map(offer => 
      offer.id === offerId ? { ...offer, status: newStatus } : offer
    ))
    setUpdatingOffers(prev => [...prev, offerId])

    try {
      await updateOfferStatus(offerId, newStatus)
      
      analyticsEvents.offerStatusChanged(offerId, oldStatus, newStatus)
      
      toast({
        title: 'Offer updated',
        description: `Offer ${newStatus} successfully.`
      })
    } catch (error) {
      // Rollback optimistic update
      setOffers(prev => prev.map(offer => 
        offer.id === offerId ? { ...offer, status: oldStatus } : offer
      ))
      
      console.error('Error updating offer status:', error)
      toast({
        title: 'Update failed',
        description: 'Failed to update offer status. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setUpdatingOffers(prev => prev.filter(id => id !== offerId))
    }
  }

  const handleRequestDocs = (offerId: string) => {
    toast({
      title: 'Request sent',
      description: 'Document request sent (placeholder functionality).'
    })
  }

  const handleCompare = () => {
    if (selectedOffers.length === 0) return
    
    analyticsEvents.offerCompared(selectedOffers)
    setCompareDrawerOpen(true)
  }

  const handleClearSelection = () => {
    setSelectedOffers([])
    setCompareDrawerOpen(false)
    
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('compare')
    setSearchParams(newParams)
  }

  const selectedOffersData = offers.filter(offer => selectedOffers.includes(offer.id))

  if (!user) {
    return <LoadingSpinner />
  }

  return (
    <AppLayout>
      <SEOHead 
        title="Landlord Offers - Manage Property Applications"
        description="Review and manage rental offers for your properties. Compare applications, update status, and communicate with potential tenants."
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Offers</h1>
          <p className="text-muted-foreground mt-2">
            Review and manage rental applications for your properties
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Property Offers</CardTitle>
                <CardDescription>
                  {offers.length} offer{offers.length !== 1 ? 's' : ''} 
                  {selectedListingId && listings.length > 0 && (
                    ` for ${listings.find(l => l.id === selectedListingId)?.title || 'selected property'}`
                  )}
                </CardDescription>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <ListingFilter
                  listings={listings}
                  selectedListingId={selectedListingId}
                  onListingChange={handleListingFilter}
                  loading={loading}
                />
                
                {selectedOffers.length > 0 && (
                  <Button onClick={handleCompare} variant="outline">
                    Compare ({selectedOffers.length})
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <OffersTable
              offers={offers}
              selectedOffers={selectedOffers}
              onOfferSelect={handleOfferSelect}
              onStatusChange={handleStatusChange}
              onRequestDocs={handleRequestDocs}
              loading={loading}
              updatingOffers={updatingOffers}
            />
          </CardContent>
        </Card>

        <OfferCompareDrawer
          offers={selectedOffersData}
          open={compareDrawerOpen}
          onOpenChange={setCompareDrawerOpen}
          onClearSelection={handleClearSelection}
        />
      </div>
    </AppLayout>
  )
}

export default LandlordOffers