
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, DollarSign, Calendar } from 'lucide-react'
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
        {/* Location */}
        <div className="flex items-center text-text-muted">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">
            {property.location || 'Location not specified'}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
          <span className="text-lg font-semibold text-text-primary">
            {property.price ? `$${property.price.toLocaleString()}/month` : 'Price on request'}
          </span>
        </div>

        {/* Description */}
        {property.description && (
          <p className="text-text-muted text-sm line-clamp-3">
            {property.description}
          </p>
        )}

        {/* Listed Date */}
        <div className="flex items-center text-sm text-text-muted">
          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>Listed {new Date(property.created_at).toLocaleDateString()}</span>
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
