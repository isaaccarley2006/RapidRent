import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Check } from 'lucide-react'
import { TenantProfile } from '@/types/profile'

interface PersonalInfoCardProps {
  formData: Partial<TenantProfile>
  setFormData: (data: Partial<TenantProfile>) => void
  userEmail: string
}

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  formData,
  setFormData,
  userEmail
}) => {
  const completedFields = [
    formData.full_name,
    formData.phone,
    formData.date_of_birth,
    formData.national_insurance_number
  ].filter(Boolean).length

  const totalFields = 4
  const completionPercentage = Math.round((completedFields / totalFields) * 100)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            Personal Information
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-sm text-muted-foreground">{completionPercentage}% complete</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={formData.full_name || ''}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              placeholder="Enter your full legal name"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Input
                id="email"
                value={formData.email || userEmail || ''}
                disabled
                className="bg-muted/50 pr-8"
              />
              <Check className="absolute right-2 top-2.5 w-4 h-4 text-green-500" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <div className="relative">
              <Input
                id="phone"
                value={formData.phone || ''}
                disabled
                className="bg-muted/50 pr-8"
                placeholder="Phone number from registration"
              />
              {formData.phone && <Check className="absolute right-2 top-2.5 w-4 h-4 text-green-500" />}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Phone number is taken from your registration details
            </p>
          </div>
          
          <div>
            <Label htmlFor="date_of_birth">Date of Birth *</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth || ''}
              onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="national_insurance_number">National Insurance Number</Label>
            <Input
              id="national_insurance_number"
              value={formData.national_insurance_number || ''}
              onChange={(e) => setFormData({...formData, national_insurance_number: e.target.value})}
              placeholder="XX 12 34 56 X"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}