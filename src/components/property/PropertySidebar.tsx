
import React from 'react'
import { DollarSign, Home, Calendar, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

interface Property {
  id: string
  price: number | null
  status: string
  created_at: string
}

interface PropertySidebarProps {
  property: Property
  onMakeOffer: () => void
}

export const PropertySidebar: React.FC<PropertySidebarProps> = ({
  property,
  onMakeOffer
}) => {
  const { user } = useAuth()

  return (
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
            onClick={onMakeOffer}
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

        {/* Additional Property Details */}
        <div className="pt-6 border-t border-muted space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Home className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm text-text-muted">Property Type</span>
            </div>
            <span className="text-sm text-text-primary font-medium">Apartment</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm text-text-muted">Furnished</span>
            </div>
            <span className="text-sm text-text-primary font-medium">Yes</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm text-text-muted">Minimum Stay</span>
            </div>
            <span className="text-sm text-text-primary font-medium">12 months</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm text-text-muted">Available From</span>
            </div>
            <span className="text-sm text-text-primary font-medium">
              {new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
