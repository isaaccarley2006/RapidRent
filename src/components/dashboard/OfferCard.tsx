import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Loader2, Eye, Check, X, User, Mail, Phone, MapPin, Star, Shield, CheckCircle, AlertCircle, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import { OfferDetailsDialog } from './OfferDetailsDialog'

interface OfferWithDetails {
  id: string
  offer_price: number
  status: string
  preferred_move_in_date: string | null
  tenant_message: string | null
  created_at: string
  properties: {
    title: string
    location: string | null
    price: number | null
  } | null
  profiles: {
    full_name: string | null
    email: string | null
    phone: string | null
    date_of_birth: string | null
    national_insurance_number: string | null
    current_address: string | null
    previous_address: string | null
    time_at_current_address: string | null
    employment_status: string | null
    employer_name: string | null
    employer_address: string | null
    job_title: string | null
    employment_start_date: string | null
    annual_income: number | null
    credit_score: number | null
    bank_name: string | null
    account_holder_name: string | null
    sort_code: string | null
    has_pets: boolean | null
    pet_details: string | null
    is_smoker: boolean | null
    tenant_references: string | null
    additional_notes: string | null
    emergency_contact_name: string | null
    emergency_contact_phone: string | null
    emergency_contact_relationship: string | null
    identity_verified: boolean | null
    employment_verified: boolean | null
    income_verified: boolean | null
    credit_verified: boolean | null
    references_verified: boolean | null
    bank_verified: boolean | null
    profile_completion_percentage: number | null
    current_rental_situation: string | null
  } | null
}

interface OfferCardProps {
  offer: OfferWithDetails
  updating: string | null
  onUpdateStatus: (offerId: string, status: 'accepted' | 'rejected') => void
  onSelectOffer: (offer: OfferWithDetails) => void
}

export const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  updating,
  onUpdateStatus,
  onSelectOffer
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount)
  }

  // Calculate tenant score based on available data  
  const calculateTenantScore = (): number => {
    if (!offer.profiles) return 0
    
    let score = 0
    let maxScore = 0

    // Verification status (40% of total score)
    const verifications = [
      offer.profiles.identity_verified,
      offer.profiles.employment_verified,
      offer.profiles.income_verified,
      offer.profiles.credit_verified,
      offer.profiles.references_verified,
      offer.profiles.bank_verified
    ]
    const verifiedCount = verifications.filter(Boolean).length
    score += (verifiedCount / 6) * 40
    maxScore += 40

    // Credit score (30% of total score)
    if (offer.profiles.credit_score) {
      const creditScore = offer.profiles.credit_score
      if (creditScore >= 800) score += 30
      else if (creditScore >= 700) score += 25
      else if (creditScore >= 600) score += 20
      else if (creditScore >= 500) score += 15
      else score += 10
    }
    maxScore += 30

    // Income ratio (20% of total score)
    if (offer.profiles.annual_income && offer.properties?.price) {
      const monthlyIncome = offer.profiles.annual_income / 12
      const rentToIncomeRatio = (offer.properties.price / monthlyIncome) * 100
      if (rentToIncomeRatio <= 25) score += 20
      else if (rentToIncomeRatio <= 30) score += 15
      else if (rentToIncomeRatio <= 35) score += 10
      else score += 5
    }
    maxScore += 20

    // Employment status (10% of total score)
    if (offer.profiles.employment_status) {
      if (offer.profiles.employment_status === 'employed') score += 10
      else if (offer.profiles.employment_status === 'self-employed') score += 8
      else if (offer.profiles.employment_status === 'student') score += 6
      else score += 3
    }
    maxScore += 10

    return Math.round((score / maxScore) * 100)
  }

  const tenantScore = calculateTenantScore()

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getCreditScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-600 bg-green-50'
    if (score >= 700) return 'text-blue-600 bg-blue-50'
    if (score >= 600) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getCreditScoreLabel = (score: number) => {
    if (score >= 800) return 'Excellent'
    if (score >= 700) return 'Good'
    if (score >= 600) return 'Fair'
    return 'Poor'
  }

  const getVerificationCount = () => {
    if (!offer.profiles) return 0
    const verifications = [
      offer.profiles.identity_verified,
      offer.profiles.employment_verified,
      offer.profiles.income_verified,
      offer.profiles.credit_verified,
      offer.profiles.references_verified,
      offer.profiles.bank_verified
    ]
    return verifications.filter(Boolean).length
  }

  const getIncomeToRentRatio = () => {
    if (!offer.profiles?.annual_income || !offer.properties?.price) return null
    const monthlyIncome = offer.profiles.annual_income / 12
    return Math.round((offer.properties.price / monthlyIncome) * 100)
  }

  const verificationCount = getVerificationCount()
  const incomeToRentRatio = getIncomeToRentRatio()

  // Debug logging to track data issues
  React.useEffect(() => {
    console.log('OfferCard Debug Data:', {
      offerId: offer.id,
      profilesExists: !!offer.profiles,
      verificationCount,
      verificationData: {
        identity_verified: offer.profiles?.identity_verified,
        employment_verified: offer.profiles?.employment_verified,
        income_verified: offer.profiles?.income_verified,
        credit_verified: offer.profiles?.credit_verified,
        references_verified: offer.profiles?.references_verified,
        bank_verified: offer.profiles?.bank_verified
      },
      financialData: {
        annual_income: offer.profiles?.annual_income,
        credit_score: offer.profiles?.credit_score
      }
    })
  }, [offer.id, offer.profiles, verificationCount])

  return (
    <Card className="relative overflow-hidden border border-border hover:shadow-md transition-shadow animate-fade-in">
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <Badge className={getStatusColor(offer.status)}>
          {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          {offer.properties?.title && (
            <h3 className="font-semibold text-lg text-foreground pr-20">
              {offer.properties.title}
            </h3>
          )}
          {offer.properties?.location && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span className="text-sm">{offer.properties.location}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Applicant Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">
                Applicant
              </span>
            </div>
            {tenantScore > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/50">
                <Star className={`w-4 h-4 ${getScoreColor(tenantScore)}`} />
                <span className={`text-sm font-semibold ${getScoreColor(tenantScore)}`}>
                  {tenantScore}%
                </span>
              </div>
            )}
          </div>

          {/* Tenant Quality Section */}
          <div className="p-3 bg-secondary/30 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Tenant Quality</span>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  {verificationCount}/6 Verified
                </span>
              </div>
            </div>
            
            {/* Verification Badges */}
            <div className="flex flex-wrap gap-1">
              {offer.profiles?.identity_verified && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  ID
                </Badge>
              )}
              {offer.profiles?.employment_verified && (
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Employment
                </Badge>
              )}
              {offer.profiles?.income_verified && (
                <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Income
                </Badge>
              )}
              {offer.profiles?.credit_verified && (
                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Credit
                </Badge>
              )}
              {offer.profiles?.references_verified && (
                <Badge variant="secondary" className="text-xs bg-teal-100 text-teal-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  References
                </Badge>
              )}
              {offer.profiles?.bank_verified && (
                <Badge variant="secondary" className="text-xs bg-indigo-100 text-indigo-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Bank
                </Badge>
              )}
            </div>

            {/* Financial Health */}
            <div className="grid grid-cols-2 gap-3">
              {offer.profiles?.credit_score ? (
                <div className="text-center">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getCreditScoreColor(offer.profiles.credit_score)}`}>
                    {offer.profiles.credit_score} • {getCreditScoreLabel(offer.profiles.credit_score)}
                  </div>
                  <span className="text-xs text-muted-foreground">Credit Score</span>
                </div>
              ) : (
                <div className="text-center">
                  <div className="px-2 py-1 rounded text-xs font-medium text-gray-500 bg-gray-50">
                    No Score
                  </div>
                  <span className="text-xs text-muted-foreground">Credit Score</span>
                </div>
              )}
              
              {incomeToRentRatio ? (
                <div className="text-center">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    incomeToRentRatio <= 30 ? 'text-green-600 bg-green-50' : 
                    incomeToRentRatio <= 40 ? 'text-yellow-600 bg-yellow-50' : 
                    'text-red-600 bg-red-50'
                  }`}>
                    {incomeToRentRatio}% of income
                  </div>
                  <span className="text-xs text-muted-foreground">Rent Ratio</span>
                </div>
              ) : (
                <div className="text-center">
                  <div className="px-2 py-1 rounded text-xs font-medium text-gray-500 bg-gray-50">
                    No Income
                  </div>
                  <span className="text-xs text-muted-foreground">Rent Ratio</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Offer Details */}
        <div className="space-y-3 p-3 bg-secondary/20 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Offer Amount</span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(offer.offer_price)}/month
            </span>
          </div>
          
          {offer.properties?.price && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Listed Price</span>
              <span className="text-sm text-muted-foreground">
                {formatCurrency(offer.properties.price)}/month
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Move-in Date</span>
            <span className="text-sm font-medium">
              {offer.preferred_move_in_date ? 
                format(new Date(offer.preferred_move_in_date), 'MMM d, yyyy') : 
                'Flexible'
              }
            </span>
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-2">
          {offer.profiles?.employment_status && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Employment</span>
              <span className="text-sm font-medium capitalize">{offer.profiles.employment_status}</span>
            </div>
          )}
          
          {offer.profiles?.annual_income ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Annual Income</span>
              <span className="text-sm font-medium flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                {formatCurrency(offer.profiles.annual_income)}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Annual Income</span>
              <span className="text-sm text-gray-500">Not provided</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Pets</span>
            <span className={`text-sm ${offer.profiles?.has_pets ? 'text-orange-600' : 'text-green-600'}`}>
              {offer.profiles?.has_pets ? 'Yes' : 'No'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Smoker</span>
            <span className={`text-sm ${offer.profiles?.is_smoker ? 'text-red-600' : 'text-green-600'}`}>
              {offer.profiles?.is_smoker ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        {/* Message Preview */}
        {offer.tenant_message && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Message:</p>
            <p className="text-sm italic line-clamp-2">"{offer.tenant_message}"</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onSelectOffer(offer)}
                className="flex-1 hover-scale"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </DialogTrigger>
            <OfferDetailsDialog 
              offer={offer}
              updating={updating}
              onUpdateStatus={onUpdateStatus}
            />
          </Dialog>

          {offer.status === 'pending' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateStatus(offer.id, 'rejected')}
                disabled={updating === offer.id}
                className="px-3 hover-scale"
              >
                <X className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={() => onUpdateStatus(offer.id, 'accepted')}
                disabled={updating === offer.id}
                className="px-3 hover-scale"
              >
                {updating === offer.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}