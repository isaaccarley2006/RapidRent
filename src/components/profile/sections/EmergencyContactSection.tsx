import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TenantProfile } from '@/types/profile'

interface EmergencyContactSectionProps {
  formData: Partial<TenantProfile>
  setFormData: (data: Partial<TenantProfile>) => void
}

export const EmergencyContactSection: React.FC<EmergencyContactSectionProps> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Emergency Contact</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="emergency_contact_name">Contact Name</Label>
          <Input
            id="emergency_contact_name"
            value={formData.emergency_contact_name || ''}
            onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
            placeholder="Emergency contact name"
          />
        </div>
        <div>
          <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
          <Input
            id="emergency_contact_phone"
            value={formData.emergency_contact_phone || ''}
            onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})}
            placeholder="Emergency contact phone"
          />
        </div>
        <div>
          <Label htmlFor="emergency_contact_relationship">Relationship</Label>
          <Input
            id="emergency_contact_relationship"
            value={formData.emergency_contact_relationship || ''}
            onChange={(e) => setFormData({...formData, emergency_contact_relationship: e.target.value})}
            placeholder="e.g., Parent, Sibling"
          />
        </div>
      </div>
    </div>
  )
}