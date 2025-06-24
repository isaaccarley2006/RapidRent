
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

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

interface PropertyCardProps {
  property: Property
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const formatPrice = (price: number | null) => {
    if (!price) return 'Price on request'
    return `£${price.toLocaleString()}/month`
  }

  const formatDescription = (description: string | null) => {
    if (!description) return 'No description available'
    return description.length > 120 
      ? `${description.substring(0, 120)}...` 
      : description
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'listed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rented':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleMakeOffer = () => {
    // TODO: Implement make offer functionality
    console.log('Make offer for property:', property.id)
  }

  const handleViewDetails = () => {
    // TODO: Implement view details functionality
    console.log('View details for property:', property.id)
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </span>
          <span className="text-lg font-semibold text-primary">
            {formatPrice(property.price)}
          </span>
        </div>
        <CardTitle className="text-xl line-clamp-2">
          {property.title}
        </CardTitle>
        {property.location && (
          <p className="text-sm text-gray-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.location}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="pb-4">
        <p className="text-gray-700 text-sm leading-relaxed">
          {formatDescription(property.description)}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
        {property.status === 'listed' && (
          <Button
            className="flex-1"
            onClick={handleMakeOffer}
          >
            Make Offer
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
