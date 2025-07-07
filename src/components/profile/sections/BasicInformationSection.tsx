import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TenantProfile } from '@/types/profile'

interface BasicInformationSectionProps {
  formData: Partial<TenantProfile>
  setFormData: (data: Partial<TenantProfile>) => void
  userEmail: string
}

export const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({
  formData,
  setFormData,
  userEmail
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <Input
          id="email"
          value={formData.email || userEmail || ''}
          disabled
          className="bg-gray-50"
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          value={formData.phone || ''}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          placeholder="Enter your phone number"
        />
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
  )
}