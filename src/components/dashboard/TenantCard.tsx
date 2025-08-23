import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Banknote, 
  Home,
  PawPrint, 
  Cigarette,
  Star,
  Shield,
  TrendingUp
} from 'lucide-react'

interface TenantProfile {
  full_name: string | null
  email: string | null
  phone: string | null
  employment_status: string | null
  annual_income: number | null
  current_rental_situation: string | null
  has_pets: boolean | null
  pet_details: string | null
  is_smoker: boolean | null
  tenant_references: string | null
  additional_notes: string | null
  credit_score: number | null
  identity_verified: boolean | null
  employment_verified: boolean | null
  income_verified: boolean | null
  credit_verified: boolean | null
  references_verified: boolean | null
  bank_verified: boolean | null
}

interface TenantCardProps {
  profile: TenantProfile
  offerPrice: number
  listedPrice: number | null
  showFullDetails?: boolean
}

export const TenantCard: React.FC<TenantCardProps> = ({ 
  profile, 
  offerPrice, 
  listedPrice,
  showFullDetails = false 
}) => {
  // Calculate tenant score based on available data
  const calculateTenantScore = (): number => {
    let score = 0
    let maxScore = 0

    // Verification status (40% of total score)
    const verifications = [
      profile.identity_verified,
      profile.employment_verified,
      profile.income_verified,
      profile.credit_verified,
      profile.references_verified,
      profile.bank_verified
    ]
    const verifiedCount = verifications.filter(Boolean).length
    score += (verifiedCount / 6) * 40
    maxScore += 40

    // Credit score (30% of total score)
    if (profile.credit_score) {
      const creditScore = profile.credit_score
      if (creditScore >= 800) score += 30
      else if (creditScore >= 700) score += 25
      else if (creditScore >= 600) score += 20
      else if (creditScore >= 500) score += 15
      else score += 10
    }
    maxScore += 30

    // Income ratio (20% of total score)
    if (profile.annual_income && listedPrice) {
      const monthlyIncome = profile.annual_income / 12
      const rentToIncomeRatio = (listedPrice / monthlyIncome) * 100
      if (rentToIncomeRatio <= 25) score += 20
      else if (rentToIncomeRatio <= 30) score += 15
      else if (rentToIncomeRatio <= 35) score += 10
      else score += 5
    }
    maxScore += 20

    // Employment status (10% of total score)
    if (profile.employment_status) {
      if (profile.employment_status === 'employed') score += 10
      else if (profile.employment_status === 'self-employed') score += 8
      else if (profile.employment_status === 'student') score += 6
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

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount)
  }

  const getInitials = (name: string | null) => {
    if (!name) return 'T'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const verifiedBadges = [
    { key: 'identity_verified', label: 'ID', icon: Shield },
    { key: 'employment_verified', label: 'Employment', icon: Briefcase },
    { key: 'income_verified', label: 'Income', icon: Banknote },
    { key: 'credit_verified', label: 'Credit', icon: TrendingUp },
    { key: 'references_verified', label: 'References', icon: User },
    { key: 'bank_verified', label: 'Bank', icon: Home }
  ]

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(profile.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {profile.full_name || 'Anonymous Tenant'}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Star className={`w-4 h-4 ${getScoreColor(tenantScore)}`} />
                <span className={`font-semibold ${getScoreColor(tenantScore)}`}>
                  {tenantScore}% Match
                </span>
              </div>
            </div>
          </div>
          <Badge className={getScoreBadgeColor(tenantScore)}>
            {tenantScore >= 80 ? 'Excellent' : tenantScore >= 60 ? 'Good' : 'Fair'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="space-y-2">
          {profile.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{profile.email}</span>
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{profile.phone}</span>
            </div>
          )}
        </div>

        {/* Offer Details */}
        <div className="p-3 bg-secondary/20 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Offer Amount</span>
            <span className="font-bold text-primary">
              {formatCurrency(offerPrice)}/month
            </span>
          </div>
          {listedPrice && (
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-muted-foreground">vs Listed Price</span>
              <span className={`text-xs font-medium ${
                offerPrice >= listedPrice ? 'text-green-600' : 'text-orange-600'
              }`}>
                {offerPrice >= listedPrice ? '+' : ''}{offerPrice - listedPrice}
              </span>
            </div>
          )}
        </div>

        {/* Key Information */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {profile.employment_status && (
            <div>
              <span className="text-muted-foreground">Employment:</span>
              <p className="font-medium">{profile.employment_status}</p>
            </div>
          )}
          {profile.annual_income && (
            <div>
              <span className="text-muted-foreground">Annual Income:</span>
              <p className="font-medium">{formatCurrency(profile.annual_income)}</p>
            </div>
          )}
          {profile.credit_score && (
            <div>
              <span className="text-muted-foreground">Credit Score:</span>
              <p className="font-medium">{profile.credit_score}</p>
            </div>
          )}
          <div>
            <span className="text-muted-foreground">Pets:</span>
            <p className="font-medium flex items-center gap-1">
              {profile.has_pets ? (
                <>
                  <PawPrint className="w-3 h-3" />
                  Yes
                </>
              ) : (
                'No'
              )}
            </p>
          </div>
        </div>

        {/* Verification Status */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Verified Information:</p>
          <div className="flex flex-wrap gap-1">
            {verifiedBadges.map(({ key, label, icon: Icon }) => {
              const isVerified = profile[key as keyof TenantProfile] as boolean
              return (
                <Badge
                  key={key}
                  variant={isVerified ? "default" : "secondary"}
                  className={`text-xs ${isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {label}
                </Badge>
              )
            })}
          </div>
        </div>

        {/* Additional Details for Full View */}
        {showFullDetails && (
          <>
            {profile.current_rental_situation && (
              <div>
                <span className="text-sm text-muted-foreground">Current Situation:</span>
                <p className="text-sm mt-1">{profile.current_rental_situation}</p>
              </div>
            )}
            
            {profile.pet_details && (
              <div>
                <span className="text-sm text-muted-foreground">Pet Details:</span>
                <p className="text-sm mt-1">{profile.pet_details}</p>
              </div>
            )}

            {profile.additional_notes && (
              <div>
                <span className="text-sm text-muted-foreground">Additional Notes:</span>
                <p className="text-sm mt-1 italic">"{profile.additional_notes}"</p>
              </div>
            )}

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Cigarette className="w-4 h-4 text-muted-foreground" />
                <span>Smoker: {profile.is_smoker ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}