import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Banknote, Calendar, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ProfileGate } from '@/components/renter/ProfileGate'
import { OfferReview } from '@/components/renter/OfferReview'
import { useAuth } from '@/contexts/AuthContext'
import { useRenterProfile } from '@/hooks/useRenterProfile'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { structuredOfferSchema, StructuredOfferFormData } from '@/schemas/renter'

interface Property {
  id: string
  title: string
  price: number | null
  location: string | null
  landlord_id: string
}

const StructuredOffer: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { profile, loading: profileLoading, isProfileComplete } = useRenterProfile()
  const { toast } = useToast()

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showReview, setShowReview] = useState(false)

  const form = useForm<StructuredOfferFormData>({
    resolver: zodResolver(structuredOfferSchema),
    defaultValues: {
      property_id: id || '',
      offer_price: 0,
      preferred_move_in_date: '',
      tenant_message: ''
    }
  })

  const { register, handleSubmit, formState: { errors }, watch } = form
  const watchedValues = watch()

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return

      try {
        const { data, error } = await supabase
          .from('properties')
          .select('id, title, price, location, landlord_id')
          .eq('id', id)
          .single()

        if (error) throw error
        setProperty(data)
      } catch (error) {
        console.error('Error fetching property:', error)
        toast({
          title: "Error loading property",
          description: "Please try refreshing the page.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id, toast])

  const handleOfferSubmit = async (data: StructuredOfferFormData) => {
    if (!user || !property) return

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('offers')
        .insert({
          property_id: data.property_id,
          listing_id: data.property_id, // Sync trigger will ensure consistency
          tenant_id: user.id,
          renter_id: user.id, // Sync trigger will ensure consistency
          offer_price: data.offer_price,
          preferred_move_in_date: data.preferred_move_in_date,
          tenant_message: data.tenant_message,
          status: 'submitted'
        })

      if (error) throw error

      toast({
        title: "Offer submitted successfully!",
        description: "The landlord will review your offer and get back to you."
      })

      navigate('/dashboard')
    } catch (error) {
      console.error('Error submitting offer:', error)
      toast({
        title: "Error submitting offer",
        description: "Please try again.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleReviewSubmit = (data: StructuredOfferFormData) => {
    setShowReview(true)
  }

  const handleConfirmOffer = () => {
    handleOfferSubmit(watchedValues)
  }

  const handleBackToEdit = () => {
    setShowReview(false)
  }

  if (loading || profileLoading) {
    return <LoadingSpinner />
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Property not found</h2>
          <Button onClick={() => navigate('/listings')}>Back to Listings</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Submit Offer - {property.title} - RapidRent</title>
        <meta name="description" content={`Submit a verified offer for ${property.title}`} />
      </Helmet>
      
      <div className="min-h-screen bg-background font-sans">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(`/properties/${id}`)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Property
            </Button>
            
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              {showReview ? 'Review Your Offer' : 'Submit Verified Offer'}
            </h1>
            <p className="text-text-muted">
              {showReview 
                ? 'Please review your offer details before submitting'
                : `Submit your application for ${property.title}`
              }
            </p>
          </div>

          {/* Profile Gate */}
          {!showReview && (
            <ProfileGate
              isComplete={isProfileComplete()}
              completionPercentage={profile?.profile_completion_percentage || 0}
              onCompleteProfile={() => navigate('/renter/profile')}
            />
          )}

          {showReview ? (
            // Review Screen
            profile && (
              <OfferReview
                property={property}
                profile={profile}
                offerData={watchedValues}
                onConfirm={handleConfirmOffer}
                onEdit={handleBackToEdit}
                submitting={submitting}
              />
            )
          ) : (
            // Offer Form
            <form onSubmit={handleSubmit(handleReviewSubmit)} className="space-y-6">
              {/* Property Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{property.title}</h3>
                    <p className="text-text-muted">{property.location}</p>
                    {property.price && (
                      <p className="text-lg font-medium">
                        Listed at: £{Math.round(property.price).toLocaleString()}/month
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Offer Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-primary" />
                    Your Offer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="offer_price">Offer Price (£/month) *</Label>
                      <Input
                        id="offer_price"
                        type="number"
                        {...register('offer_price', { valueAsNumber: true })}
                        placeholder={property.price ? `Listed at £${Math.round(property.price).toLocaleString()}` : 'Enter your offer'}
                        disabled={!isProfileComplete()}
                      />
                      {errors.offer_price && (
                        <p className="text-sm text-red-600 mt-1">{errors.offer_price.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="preferred_move_in_date">Preferred Move-in Date *</Label>
                      <Input
                        id="preferred_move_in_date"
                        type="date"
                        {...register('preferred_move_in_date')}
                        disabled={!isProfileComplete()}
                      />
                      {errors.preferred_move_in_date && (
                        <p className="text-sm text-red-600 mt-1">{errors.preferred_move_in_date.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="tenant_message">Message to Landlord</Label>
                    <Textarea
                      id="tenant_message"
                      {...register('tenant_message')}
                      placeholder="Tell the landlord why you're interested in this property and what makes you a good tenant..."
                      rows={4}
                      disabled={!isProfileComplete()}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={!isProfileComplete()}
                  className="min-w-32"
                >
                  Review Offer
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

export default StructuredOffer