
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, MapPin, DollarSign, Home, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { StatusBadge } from '@/components/property/StatusBadge'

interface Property {
  id: string
  title: string
  description: string | null
  price: number | null
  location: string | null
  status: string
  landlord_id: string
  created_at: string
  updated_at: string
}

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const fetchProperty = async (): Promise<Property> => {
    if (!id) throw new Error('Property ID is required')

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching property:', error)
      throw error
    }

    return data
  }

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: fetchProperty,
    enabled: !!id
  })

  const handleBackToListings = () => {
    navigate('/listings')
  }

  const handleMakeOffer = () => {
    if (user) {
      navigate(`/offers/new/${id}`)
    } else {
      navigate('/auth')
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background font-sans">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-text-primary mb-4">
              Property Not Found
            </h1>
            <p className="text-text-muted mb-6">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Button 
              onClick={handleBackToListings}
              variant="outline"
              className="bg-primary text-white hover:bg-primary-dark"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Listings
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="border-b border-muted bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={handleBackToListings}
                className="p-2 text-text-muted hover:text-text-primary"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="text-2xl font-bold text-text-primary">
                Rent<span className="text-primary">View</span>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              {!user ? (
                <>
                  <Button 
                    onClick={() => navigate('/auth')}
                    variant="ghost"
                    className="text-text-muted hover:text-text-primary"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => navigate('/auth')}
                    className="bg-primary hover:bg-primary-dark text-white rounded-xl"
                  >
                    Get Started
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-primary hover:bg-primary-dark text-white rounded-xl"
                >
                  Dashboard
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Property Image Placeholder */}
        <div className="mb-8">
          <div className="w-full h-96 bg-surface rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Home className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <p className="text-text-muted">Property Image</p>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl font-bold text-text-primary mb-2">
                      {property.title}
                    </CardTitle>
                    <div className="flex items-center text-text-muted mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{property.location || 'Location not specified'}</span>
                    </div>
                  </div>
                  <StatusBadge status={property.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold text-text-primary mb-4">
                    Description
                  </h3>
                  <p className="text-text-muted leading-relaxed">
                    {property.description || 'No description available for this property.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-text-primary">
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Monthly Rent */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-primary mr-2" />
                    <span className="text-text-muted">Monthly Rent</span>
                  </div>
                  <span className="text-2xl font-bold text-text-primary">
                    {property.price ? `$${property.price.toLocaleString()}` : 'Price on request'}
                  </span>
                </div>

                {/* Property Type */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Home className="w-5 h-5 text-primary mr-2" />
                    <span className="text-text-muted">Property Type</span>
                  </div>
                  <span className="text-text-primary font-medium">
                    Rental Property
                  </span>
                </div>

                {/* Listed Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-primary mr-2" />
                    <span className="text-text-muted">Listed</span>
                  </div>
                  <span className="text-text-primary font-medium">
                    {new Date(property.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* CTA Button */}
                <div className="pt-6 border-t border-muted">
                  <Button 
                    onClick={handleMakeOffer}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-3 text-lg rounded-xl"
                    disabled={property.status !== 'listed'}
                  >
                    {user ? 'Make an Offer' : 'Sign in to Make an Offer'}
                  </Button>
                  
                  {property.status !== 'listed' && (
                    <p className="text-sm text-text-muted text-center mt-2">
                      This property is no longer available for offers
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails
