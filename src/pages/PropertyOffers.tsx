import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { 
  ArrowLeft, 
  Building, 
  MapPin, 
  Users, 
  TrendingUp, 
  Clock,
  DollarSign,
  Star,
  Eye
} from 'lucide-react'
import { TenantCard } from '@/components/dashboard/TenantCard'
import { OfferCard } from '@/components/dashboard/OfferCard'

interface PropertyWithOffers {
  id: string
  title: string
  description: string | null
  location: string | null
  price: number | null
  status: string
  bedrooms: number | null
  bathrooms: number | null
  property_type: string | null
  images: string[] | null
  created_at: string
}

interface OfferWithDetails {
  id: string
  offer_price: number
  status: string
  preferred_move_in_date: string | null
  tenant_message: string | null
  created_at: string
  tenant_id: string
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

export default function PropertyOffers() {
  const { propertyId } = useParams<{ propertyId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [property, setProperty] = useState<PropertyWithOffers | null>(null)
  const [offers, setOffers] = useState<OfferWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (!propertyId || !user) return
    
    fetchPropertyAndOffers()
    setupRealtimeSubscription()
  }, [propertyId, user])

  const fetchPropertyAndOffers = async () => {
    if (!propertyId || !user) return

    try {
      // Fetch property details
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .eq('landlord_id', user.id)
        .single()

      if (propertyError) throw propertyError
      setProperty(propertyData)

      // Fetch offers with profiles using manual join
      const { data: offersData, error: offersError } = await supabase
        .from('offers')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false })

      if (offersError) throw offersError

      // Manually fetch profiles for each offer
      const offersWithProfiles = await Promise.all(
        (offersData || []).map(async (offer) => {
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
            profiles: profileData
          }
        })
      )

      setOffers(offersWithProfiles)
    } catch (error) {
      console.error('Error fetching property and offers:', error)
      toast({
        title: "Error loading property data",
        description: "Please try refreshing the page.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    if (!propertyId) return

    const channel = supabase
      .channel(`property-${propertyId}-offers`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'offers',
          filter: `property_id=eq.${propertyId}`
        },
        () => {
          fetchPropertyAndOffers()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
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

      fetchPropertyAndOffers()
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount)
  }

  const getPropertyInsights = () => {
    if (offers.length === 0) return null

    const avgOfferPrice = offers.reduce((sum, offer) => sum + offer.offer_price, 0) / offers.length
    const highestOffer = Math.max(...offers.map(o => o.offer_price))
    const pendingOffers = offers.filter(o => o.status === 'pending').length
    const avgTenantScore = offers
      .filter(o => o.profiles)
      .reduce((sum, offer) => {
        // Calculate score for each tenant (simplified version)
        const verifications = [
          offer.profiles?.identity_verified,
          offer.profiles?.employment_verified,
          offer.profiles?.income_verified,
          offer.profiles?.credit_verified,
          offer.profiles?.references_verified,
          offer.profiles?.bank_verified
        ].filter(Boolean).length
        return sum + (verifications / 6) * 100
      }, 0) / offers.filter(o => o.profiles).length

    return {
      avgOfferPrice,
      highestOffer,
      pendingOffers,
      avgTenantScore: Math.round(avgTenantScore)
    }
  }

  const insights = getPropertyInsights()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard/landlord')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">Property not found</h2>
            <p className="text-muted-foreground">The property you're looking for doesn't exist or you don't have access to it.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard/landlord')}
          className="hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Property Header */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-start gap-6">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-32 h-24 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=96&width=128"
              }}
            />
          ) : (
            <div className="w-32 h-24 bg-gradient-to-br from-muted/40 to-muted/60 rounded-lg flex items-center justify-center">
              <Building className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground mb-2">{property.title}</h1>
            {property.location && (
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                <span>{property.location}</span>
              </div>
            )}
            <div className="flex items-center gap-4">
              {property.price && (
                <span className="text-xl font-semibold text-primary">
                  {formatCurrency(property.price)}/month
                </span>
              )}
              <Badge className={property.status === 'listed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {property.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Cards */}
      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Offers</p>
                  <p className="text-2xl font-bold">{offers.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{insights.pendingOffers}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Highest Offer</p>
                  <p className="text-lg font-bold">{formatCurrency(insights.highestOffer)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Tenant Score</p>
                  <p className="text-2xl font-bold">{insights.avgTenantScore}%</p>
                </div>
                <Star className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Offers Section */}
      <Card>
        <CardHeader>
          <CardTitle>Property Offers</CardTitle>
          <CardDescription>
            {offers.length === 0 
              ? "No offers received yet for this property" 
              : `${offers.length} offer${offers.length !== 1 ? 's' : ''} received`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {offers.length === 0 ? (
            <div className="text-center py-12">
              <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No offers yet</h3>
              <p className="text-muted-foreground">
                When tenants submit offers for this property, they will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {offers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={{
                    ...offer,
                    properties: {
                      title: property.title,
                      location: property.location,
                      price: property.price
                    }
                  }}
                  updating={updating}
                  onUpdateStatus={handleUpdateStatus}
                  onSelectOffer={() => {}}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}