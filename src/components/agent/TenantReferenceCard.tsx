import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  CheckCircle, 
  Clock, 
  Eye, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail,
  Building,
  CreditCard,
  FileText
} from 'lucide-react'
import { TenantReferenceDetails } from './TenantReferenceDetails'

interface TenantData {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  current_address: string | null
  verification_status: 'verified' | 'pending' | 'incomplete'
  identity_verified: boolean | null
  employment_verified: boolean | null
  income_verified: boolean | null
  credit_verified: boolean | null
  references_verified: boolean | null
  profile_completion_percentage: number | null
  granted_at: string
  annual_income: number | null
  employer_name: string | null
}

interface TenantReferenceCardProps {
  tenant: TenantData
}

export const TenantReferenceCard: React.FC<TenantReferenceCardProps> = ({ tenant }) => {
  const [showDetails, setShowDetails] = useState(false)

  const getVerificationBadge = () => {
    const verifiedCount = [
      tenant.identity_verified,
      tenant.employment_verified,
      tenant.income_verified,
      tenant.credit_verified,
      tenant.references_verified
    ].filter(Boolean).length

    if (verifiedCount === 5) {
      return <Badge variant="default" className="bg-success text-success-foreground">Fully Verified</Badge>
    } else if (verifiedCount >= 3) {
      return <Badge variant="secondary" className="bg-warning text-warning-foreground">Partially Verified</Badge>
    } else {
      return <Badge variant="outline" className="text-muted-foreground">Incomplete</Badge>
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return 'T'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Not specified'
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getInitials(tenant.full_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground">
                  {tenant.full_name || 'Unknown Name'}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {tenant.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {tenant.email}
                    </div>
                  )}
                  {tenant.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {tenant.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getVerificationBadge()}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Key Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {tenant.current_address || 'Address not provided'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {tenant.employer_name || 'Employer not specified'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {formatCurrency(tenant.annual_income)}
              </span>
            </div>
          </div>

          {/* Verification Status */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Identity', verified: tenant.identity_verified, icon: FileText },
              { label: 'Employment', verified: tenant.employment_verified, icon: Building },
              { label: 'Income', verified: tenant.income_verified, icon: CreditCard },
              { label: 'Credit', verified: tenant.credit_verified, icon: CheckCircle },
              { label: 'References', verified: tenant.references_verified, icon: FileText }
            ].map(({ label, verified, icon: Icon }) => (
              <div key={label} className="flex items-center space-x-1">
                <Icon className={`h-3 w-3 ${verified ? 'text-success' : 'text-muted-foreground'}`} />
                <span className={`text-xs ${verified ? 'text-success' : 'text-muted-foreground'}`}>
                  {label}
                </span>
                {verified ? (
                  <CheckCircle className="h-3 w-3 text-success" />
                ) : (
                  <Clock className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          {/* Access Info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Access granted: {formatDate(tenant.granted_at)}</span>
            </div>
            <div>
              Profile: {tenant.profile_completion_percentage || 0}% complete
            </div>
          </div>
        </CardContent>
      </Card>

      {showDetails && (
        <TenantReferenceDetails
          tenant={tenant}
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  )
}