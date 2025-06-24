
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
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="aspect-video bg-gray-100 rounded-t-xl flex items-center justify-center">
        <div className="text-gray-400 text-sm">Photo Coming Soon</div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">
            {property.title}
          </h3>
          <Badge className={`ml-2 ${getStatusColor(property.status)} capitalize`}>
            {property.status}
          </Badge>
        </div>
        
        {property.location && (
          <p className="text-gray-600 text-sm mb-3">
            {property.location}
          </p>
        )}
        
        {property.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {property.description}
          </p>
        )}
        
        <div className="text-2xl font-bold text-[#FA6404] mb-4">
          {formatPrice(property.price)}
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            className="flex-1 rounded-xl border-gray-300 hover:border-[#FA6404] hover:text-[#FA6404]"
          >
            View Details
          </Button>
          {property.status === 'listed' && (
            <Button 
              onClick={handleMakeOffer}
              className="flex-1 bg-[#FA6404] hover:bg-[#e55a04] text-white rounded-xl"
            >
              Make Offer
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
