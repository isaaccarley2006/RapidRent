import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Building2, Mail, Phone, MapPin, Calendar, PoundSterling } from 'lucide-react'
import { ReferenceCheckApplication } from '@/types/referenceCheck'

interface LandlordStepProps {
  data: ReferenceCheckApplication
  updateData: (updates: Partial<ReferenceCheckApplication>) => void
}

export const LandlordStep: React.FC<LandlordStepProps> = ({
  data,
  updateData
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Previous Landlord Reference</h2>
        <p className="text-muted-foreground">
          Provide details of your most recent landlord or letting agent for verification.
        </p>
      </div>

      {/* Landlord Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="w-5 h-5 text-primary" />
            Landlord/Agent Details
          </CardTitle>
          <CardDescription>
            Contact information for your previous landlord or letting agent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="previous_landlord_name">Landlord/Agent Full Name *</Label>
            <Input
              id="previous_landlord_name"
              placeholder="John Smith or ABC Lettings Ltd"
              value={data.previous_landlord_name || ''}
              onChange={(e) => updateData({ previous_landlord_name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="previous_landlord_email">Contact Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="previous_landlord_email"
                  type="email"
                  placeholder="landlord@email.com"
                  className="pl-10"
                  value={data.previous_landlord_email || ''}
                  onChange={(e) => updateData({ previous_landlord_email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="previous_landlord_phone">Contact Phone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="previous_landlord_phone"
                  type="tel"
                  placeholder="020 1234 5678"
                  className="pl-10"
                  value={data.previous_landlord_phone || ''}
                  onChange={(e) => updateData({ previous_landlord_phone: e.target.value })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property & Tenancy Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5 text-primary" />
            Rental Property Details
          </CardTitle>
          <CardDescription>
            Information about your previous rental property and tenancy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="previous_property_address">Rented Property Address *</Label>
            <Textarea
              id="previous_property_address"
              placeholder="Full address including postcode"
              rows={3}
              value={data.previous_property_address || ''}
              onChange={(e) => updateData({ previous_property_address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="tenancy_start_date">Tenancy Start Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="tenancy_start_date"
                  type="date"
                  className="pl-10"
                  value={data.tenancy_start_date || ''}
                  onChange={(e) => updateData({ tenancy_start_date: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="tenancy_end_date">Tenancy End Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="tenancy_end_date"
                  type="date"
                  className="pl-10"
                  value={data.tenancy_end_date || ''}
                  onChange={(e) => updateData({ tenancy_end_date: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="monthly_rent_paid">Monthly Rent Paid *</Label>
              <div className="relative">
                <PoundSterling className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="monthly_rent_paid"
                  type="number"
                  placeholder="1200"
                  className="pl-10"
                  value={data.monthly_rent_paid || ''}
                  onChange={(e) => updateData({ monthly_rent_paid: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-primary mt-1" />
            <div>
              <h3 className="font-medium text-foreground mb-2">What happens next?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We'll contact your previous landlord or letting agent to verify your tenancy history, 
                rent payment record, and overall conduct as a tenant. This typically takes 1-2 business days.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}