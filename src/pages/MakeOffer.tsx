
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const MakeOffer: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>()
  const navigate = useNavigate()

  const handleBackToProperty = () => {
    navigate(`/properties/${propertyId}`)
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
                onClick={handleBackToProperty}
                className="p-2 text-text-muted hover:text-text-primary"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="text-2xl font-bold text-text-primary">
                Rent<span className="text-primary">View</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-text-primary">
              Make an Offer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Coming Soon
              </h2>
              <p className="text-text-muted mb-6">
                The offer submission feature is currently under development. 
                You'll be able to make offers on properties soon!
              </p>
              <p className="text-sm text-text-muted mb-6">
                Property ID: {propertyId}
              </p>
              <Button 
                onClick={handleBackToProperty}
                className="bg-primary hover:bg-primary-dark text-white rounded-xl"
              >
                Back to Property Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default MakeOffer
