
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
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-shadow"
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

        {/* Landlord Information */}
        <div className="pt-6 border-t border-muted">
          <h3 className="text-lg font-semibold text-foreground mb-4">Landlord Information</h3>
          
          <div className="bg-gradient-to-br from-muted/20 to-muted/40 rounded-xl p-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold text-lg">JD</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground">John Doe</h4>
                <p className="text-sm text-muted-foreground">Property Owner</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rating</span>
                <div className="flex items-center space-x-1">
                  <div className="flex text-yellow-500">
                    {'★'.repeat(5)}
                  </div>
                  <span className="text-sm font-medium text-foreground">4.8</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Response Time</span>
                <span className="text-sm font-medium text-foreground">Within 2 hours</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Properties Listed</span>
                <span className="text-sm font-medium text-foreground">12</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
