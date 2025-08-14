import React from 'react'
import { Check, Home, User, Calendar, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StructuredOfferFormData } from '@/schemas/renter'
import { TenantProfile } from '@/types/profile'

interface Property {
  id: string
  title: string
  price: number | null
  location: string | null
}

interface OfferReviewProps {
  property: Property
  profile: TenantProfile
  offerData: StructuredOfferFormData
  onConfirm: () => void
  onEdit: () => void
  submitting: boolean
}

export const OfferReview: React.FC<OfferReviewProps> = ({
  property,
  profile,
  offerData,
  onConfirm,
  onEdit,
  submitting
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Property Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5 text-primary" />
            Property Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{property.title}</h3>
            <p className="text-text-muted">{property.location}</p>
            <p className="text-lg font-medium">
              Listed at: {property.price ? formatCurrency(property.price) : 'Contact for price'}/month
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Your Offer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Your Offer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-muted">Offer Price</p>
              <p className="text-xl font-semibold text-primary">
                {formatCurrency(offerData.offer_price)}/month
              </p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Preferred Move-in Date</p>
              <p className="font-medium">{formatDate(offerData.preferred_move_in_date)}</p>
            </div>
          </div>
          {offerData.tenant_message && (
            <div className="mt-4">
              <p className="text-sm text-text-muted mb-2">Message to Landlord</p>
              <p className="text-sm bg-gray-50 p-3 rounded-lg">{offerData.tenant_message}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Your Profile Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Your Profile Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-text-muted">Full Name</p>
                <p className="font-medium">{profile.full_name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Employment Status</p>
                <p className="font-medium capitalize">{profile.employment_status || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Annual Income</p>
                <p className="font-medium">
                  {profile.annual_income ? formatCurrency(profile.annual_income) : 'Not provided'}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-text-muted">Pets</p>
                <p className="font-medium">{profile.has_pets ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Smoker</p>
                <p className="font-medium">{profile.is_smoker ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Profile Completion</p>
                <p className="font-medium">{profile.profile_completion_percentage || 0}%</p>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="mt-6">
            <p className="text-sm text-text-muted mb-3">Verification Status</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { key: 'identity', label: 'Identity', verified: profile.identity_verified },
                { key: 'employment', label: 'Employment', verified: profile.employment_verified },
                { key: 'income', label: 'Income', verified: profile.income_verified },
                { key: 'credit', label: 'Credit', verified: profile.credit_verified },
                { key: 'references', label: 'References', verified: profile.references_verified },
                { key: 'bank', label: 'Bank', verified: profile.bank_verified },
              ].map(item => (
                <div key={item.key} className="flex items-center gap-2">
                  <Badge className={item.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {item.verified ? <Check className="w-3 h-3 mr-1" /> : <Calendar className="w-3 h-3 mr-1" />}
                    {item.label}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onEdit}>
          Edit Offer
        </Button>
        <Button onClick={onConfirm} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Offer'}
        </Button>
      </div>
    </div>
  )
}