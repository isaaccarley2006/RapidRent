
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { MapPin, PoundSterling, Bed, Bath, Home, Check, X } from 'lucide-react'
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
  bedrooms: number | null
  bathrooms: number | null
  furnished: boolean
  property_type: string | null
  images?: string[]
}

interface PropertyCardProps {
  property: Property
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const navigate = useNavigate()

  const handleViewDetails = () => {
    navigate(`/properties/${property.id}`)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-semibold text-text-primary line-clamp-2">
            {property.title}
          </CardTitle>
          <StatusBadge status={property.status} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Property Image with Popup */}
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
              <img
                src={property.images?.[0] || "/placeholder.svg?height=200&width=300"}
                alt={property.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all" />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <img
              src={property.images?.[0] || "/placeholder.svg?height=400&width=600"}
              alt={property.title}
              className="w-full h-auto max-h-[80vh] object-contain"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=400&width=600"
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Location */}
        <div className="flex items-center text-text-muted">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">
            {property.location || 'Location not specified'}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center">
          <PoundSterling className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
          <span className="text-lg font-semibold text-text-primary">
            {property.price ? `£${property.price.toLocaleString()}/month` : 'Price on request'}
          </span>
        </div>

        {/* Essential Property Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-2 text-primary" />
            <span className="text-text-muted">
              {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms || 0} Bedroom${(property.bedrooms || 0) !== 1 ? 's' : ''}`}
            </span>
          </div>
          
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-2 text-primary" />
            <span className="text-text-muted">
              {property.bathrooms || 0} Bathroom{(property.bathrooms || 0) !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center">
            <Home className="w-4 h-4 mr-2 text-primary" />
            <span className="text-text-muted">
              {property.property_type || 'Property'}
            </span>
          </div>
          
          <div className="flex items-center">
            {property.furnished ? (
              <Check className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <X className="w-4 h-4 mr-2 text-red-500" />
            )}
            <span className="text-text-muted">
              {property.furnished ? 'Furnished' : 'Unfurnished'}
            </span>
          </div>
        </div>

        {/* View Details Button */}
        <Button 
          onClick={handleViewDetails}
          className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}
