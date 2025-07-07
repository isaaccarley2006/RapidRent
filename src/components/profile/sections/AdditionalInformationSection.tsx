import React from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { TenantProfile } from '@/types/profile'

interface AdditionalInformationSectionProps {
  formData: Partial<TenantProfile>
  setFormData: (data: Partial<TenantProfile>) => void
}

export const AdditionalInformationSection: React.FC<AdditionalInformationSectionProps> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Additional Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="has_pets">Do you have pets?</Label>
          <Switch
            id="has_pets"
            checked={formData.has_pets || false}
            onCheckedChange={(checked) => setFormData({...formData, has_pets: checked})}
          />
        </div>
        {formData.has_pets && (
          <div className="md:col-span-2">
            <Label htmlFor="pet_details">Pet Details</Label>
            <Textarea
              id="pet_details"
              value={formData.pet_details || ''}
              onChange={(e) => setFormData({...formData, pet_details: e.target.value})}
              placeholder="Describe your pets (type, breed, age, etc.)"
              rows={2}
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          <Label htmlFor="is_smoker">Do you smoke?</Label>
          <Switch
            id="is_smoker"
            checked={formData.is_smoker || false}
            onCheckedChange={(checked) => setFormData({...formData, is_smoker: checked})}
          />
        </div>
      </div>
    </div>
  )
}