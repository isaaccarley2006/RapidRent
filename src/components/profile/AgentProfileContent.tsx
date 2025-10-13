import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Building2, Shield, Palette, Users, CreditCard, Upload } from 'lucide-react'
import { TenantProfile } from '@/types/profile'

interface AgentProfileContentProps {
  formData: Partial<TenantProfile>
  setFormData: (data: Partial<TenantProfile>) => void
  userEmail: string
}

export const AgentProfileContent: React.FC<AgentProfileContentProps> = ({
  formData,
  setFormData,
  userEmail
}) => {
  const handleStripeConnect = () => {
    alert('Connect your Stripe account to receive payments from tenants. This will redirect to Stripe Connect setup.')
  }

  return (
    <div className="space-y-8">
      {/* Basic Agency Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Agency Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="agency-name">Agency Name</Label>
              <Input
                id="agency-name"
                value={formData.agency_name || ''}
                onChange={(e) => setFormData({ ...formData, agency_name: e.target.value })}
                placeholder="Enter agency name"
              />
            </div>
            <div>
              <Label htmlFor="vat-number">VAT Number (Optional)</Label>
              <Input
                id="vat-number"
                value={formData.vat_number || ''}
                onChange={(e) => setFormData({ ...formData, vat_number: e.target.value })}
                placeholder="GB123456789"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Contact Email</Label>
            <Input
              id="email"
              type="email"
              value={userEmail}
              disabled
              className="bg-muted"
            />
          </div>
        </CardContent>
      </Card>

      {/* Compliance Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Compliance & Accreditation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="aml-body">AML Registration Body (If applicable)</Label>
            <Input
              id="aml-body"
              value={formData.aml_registration || ''}
              onChange={(e) => setFormData({ ...formData, aml_registration: e.target.value })}
              placeholder="e.g., HMRC, FCA, RICS"
            />
          </div>
          <div>
            <Label htmlFor="membership">Professional Membership</Label>
            <Input
              id="membership"
              value={formData.professional_membership || ''}
              onChange={(e) => setFormData({ ...formData, professional_membership: e.target.value })}
              placeholder="e.g., ARLA, NAEA, RICS"
            />
          </div>
        </CardContent>
      </Card>

      {/* Branding Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Branding & Coverage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="logo-upload">Agency Logo</Label>
            <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <Button variant="outline" size="sm">
                Upload Logo
              </Button>
              <p className="text-sm text-muted-foreground mt-1">
                PNG, JPG up to 2MB
              </p>
            </div>
          </div>
          <div>
            <Label htmlFor="coverage-areas">Coverage Areas (Boroughs/Postcodes)</Label>
            <Textarea
              id="coverage-areas"
              value={formData.coverage_areas || ''}
              onChange={(e) => setFormData({ ...formData, coverage_areas: e.target.value })}
              placeholder="e.g., SW1, SW3, Chelsea, Kensington, Westminster"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Operational Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Operational Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="negotiator-emails">Additional Negotiator Accounts</Label>
            <Textarea
              id="negotiator-emails"
              value={formData.negotiator_emails || ''}
              onChange={(e) => setFormData({ ...formData, negotiator_emails: e.target.value })}
              placeholder="Enter email addresses (one per line)"
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              These users will have access to manage listings and tenants
            </p>
          </div>
          <div>
            <Label htmlFor="crm-preferences">CRM/Integration Preferences (Optional)</Label>
            <Input
              id="crm-preferences"
              value={formData.crm_preferences || ''}
              onChange={(e) => setFormData({ ...formData, crm_preferences: e.target.value })}
              placeholder="e.g., Rightmove, Zoopla, PropertyFile"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stripe Payment Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Payment Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Stripe Payment Gateway</h3>
              <p className="text-sm text-muted-foreground">
                Connect your Stripe account to receive payments from tenants
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-orange-600">
                Not Connected
              </Badge>
              <Button onClick={handleStripeConnect} variant="outline">
                Connect Stripe
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Stripe handles secure payment processing and deposits funds directly to your bank account.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}