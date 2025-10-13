import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User } from 'lucide-react'
import { TenantProfile } from '@/types/profile'
import { BasicInformationSection } from './sections/BasicInformationSection'
import { AddressInformationSection } from './sections/AddressInformationSection'

import { AdditionalInformationSection } from './sections/AdditionalInformationSection'

interface PersonalInformationTabProps {
  formData: Partial<TenantProfile>
  setFormData: (data: Partial<TenantProfile>) => void
  userEmail: string
}

export const PersonalInformationTab: React.FC<PersonalInformationTabProps> = ({
  formData,
  setFormData,
  userEmail
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <BasicInformationSection
          formData={formData}
          setFormData={setFormData}
          userEmail={userEmail}
        />

        <AddressInformationSection
          formData={formData}
          setFormData={setFormData}
        />


        <AdditionalInformationSection
          formData={formData}
          setFormData={setFormData}
        />
      </CardContent>
    </Card>
  )
}