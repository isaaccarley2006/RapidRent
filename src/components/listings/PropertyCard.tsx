
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'

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
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleMakeOffer = () => {
    if (!user) {
      navigate('/auth')
      return
    }
    // TODO: Implement make offer modal/page
    console.log('Make offer for property:', property.id)
  }

  const formatPrice = (price: number | null) => {
    if (!price) return 'Price on request'
    return `£${price.toLocaleString()}/month`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'listed':
        return 'bg-green-100 text-green-800'
      case 'rented':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="bg-card rounded-xl shadow-sm border border-muted hover:shadow-md transition-shadow duration-200">
      <div className="aspect-video bg-surface rounded-t-xl flex items-center justify-center">
        <div className="text-text-muted text-sm">Photo Coming Soon</div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-text-primary text-lg leading-tight">
            {property.title}
          </h3>
          <Badge className={`ml-2 ${getStatusColor(property.status)} capitalize`}>
            {property.status}
          </Badge>
        </div>
        
        {property.location && (
          <p className="text-text-muted text-sm mb-3">
            {property.location}
          </p>
        )}
        
        {property.description && (
          <p className="text-text-muted text-sm mb-4 line-clamp-2">
            {property.description}
          </p>
        )}
        
        <div className="text-2xl font-bold text-primary mb-4">
          {formatPrice(property.price)}
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            className="flex-1 rounded-xl border-muted hover:border-primary hover:text-primary"
          >
            View Details
          </Button>
          {property.status === 'listed' && (
            <Button 
              onClick={handleMakeOffer}
              className="flex-1 bg-primary hover:bg-primary-dark text-white rounded-xl"
            >
              Make Offer
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
