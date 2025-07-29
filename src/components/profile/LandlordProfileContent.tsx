import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Building, User, Phone, Mail } from 'lucide-react'
import { TenantProfile } from '@/types/profile'

interface LandlordProfileContentProps {
  formData: Partial<TenantProfile>
  setFormData: (data: Partial<TenantProfile>) => void
  userEmail: string
}

export const LandlordProfileContent: React.FC<LandlordProfileContentProps> = ({
  formData,
  setFormData,
  userEmail
}) => {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name || ''}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={userEmail}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth || ''}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name (Optional)</Label>
              <Input
                id="company_name"
                value={formData.employer_name || ''}
                onChange={(e) => setFormData({ ...formData, employer_name: e.target.value })}
                placeholder="Enter company name if applicable"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_address">Business Address</Label>
              <Input
                id="business_address"
                value={formData.current_address || ''}
                onChange={(e) => setFormData({ ...formData, current_address: e.target.value })}
                placeholder="Enter your business address"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_description">Business Description (Optional)</Label>
            <Textarea
              id="business_description"
              value={formData.additional_notes || ''}
              onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
              placeholder="Describe your property business or experience as a landlord"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Contact Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="preferred_contact">Preferred Contact Method</Label>
            <Textarea
              id="preferred_contact"
              value={formData.tenant_references || ''}
              onChange={(e) => setFormData({ ...formData, tenant_references: e.target.value })}
              placeholder="Let tenants know your preferred way to be contacted and any specific times"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}