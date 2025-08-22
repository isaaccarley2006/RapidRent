import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Download, 
  Printer, 
  CheckCircle, 
  Clock, 
  User, 
  Building, 
  CreditCard, 
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react'
import { useTenantReferenceDetails } from '@/hooks/useTenantReferenceDetails'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

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

interface TenantReferenceDetailsProps {
  tenant: TenantData
  isOpen: boolean
  onClose: () => void
}

export const TenantReferenceDetails: React.FC<TenantReferenceDetailsProps> = ({
  tenant,
  isOpen,
  onClose
}) => {
  const { referenceData, loading, error } = useTenantReferenceDetails(tenant.id)

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Not specified'
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not provided'
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const VerificationStatus: React.FC<{ verified: boolean | null; label: string }> = ({ verified, label }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center space-x-2">
        {verified ? (
          <>
            <CheckCircle className="h-4 w-4 text-success" />
            <Badge variant="default" className="bg-success text-success-foreground">Verified</Badge>
          </>
        ) : (
          <>
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline">Pending</Badge>
          </>
        )}
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Reference Check Details - {tenant.full_name}</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            Failed to load reference check details
          </div>
        ) : (
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-sm text-foreground">{tenant.full_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm text-foreground flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {tenant.email || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-sm text-foreground flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {tenant.phone || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                    <p className="text-sm text-foreground">
                      {formatDate(referenceData?.date_of_birth)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Address Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Current Address</label>
                    <p className="text-sm text-foreground">{referenceData?.current_address || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Previous Address</label>
                    <p className="text-sm text-foreground">{referenceData?.previous_address || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Time at Current Address</label>
                    <p className="text-sm text-foreground">{referenceData?.time_at_current_address || 'Not provided'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Employment Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Employment Status</label>
                    <p className="text-sm text-foreground">{referenceData?.employment_status || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Employer Name</label>
                    <p className="text-sm text-foreground">{referenceData?.employer_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Job Title</label>
                    <p className="text-sm text-foreground">{referenceData?.job_title || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Employment Start Date</label>
                    <p className="text-sm text-foreground">
                      {formatDate(referenceData?.employment_start_date)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Annual Income</label>
                    <p className="text-sm text-foreground">{formatCurrency(referenceData?.annual_income)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Verification Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <VerificationStatus verified={tenant.identity_verified} label="Identity Verification" />
                <Separator />
                <VerificationStatus verified={tenant.employment_verified} label="Employment Verification" />
                <Separator />
                <VerificationStatus verified={tenant.income_verified} label="Income Verification" />
                <Separator />
                <VerificationStatus verified={tenant.credit_verified} label="Credit Check" />
                <Separator />
                <VerificationStatus verified={tenant.references_verified} label="References" />
              </CardContent>
            </Card>

            {/* Additional Information */}
            {referenceData?.additional_notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Additional Notes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground">{referenceData.additional_notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}