import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Heart } from 'lucide-react'
import { TenantProfile } from '@/types/profile'

interface PreferencesCardProps {
  formData: Partial<TenantProfile>
  setFormData: (data: Partial<TenantProfile>) => void
}

export const PreferencesCard: React.FC<PreferencesCardProps> = ({
  formData,
  setFormData
}) => {
  const completedFields = [
    formData.has_pets !== null,
    formData.is_smoker !== null,
    formData.additional_notes
  ].filter(Boolean).length

  const totalFields = 3
  const completionPercentage = Math.round((completedFields / totalFields) * 100)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary" />
            </div>
            Preferences & Lifestyle
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-sm text-muted-foreground">{completionPercentage}% complete</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <Label htmlFor="has_pets" className="text-sm font-medium">Do you have pets?</Label>
            <Switch
              id="has_pets"
              checked={formData.has_pets || false}
              onCheckedChange={(checked) => setFormData({...formData, has_pets: checked})}
            />
          </div>
          
          {formData.has_pets && (
            <div>
              <Label htmlFor="pet_details">Pet Details</Label>
              <Textarea
                id="pet_details"
                value={formData.pet_details || ''}
                onChange={(e) => setFormData({...formData, pet_details: e.target.value})}
                placeholder="Describe your pets (type, breed, age, etc.)"
                rows={3}
              />
            </div>
          )}
          
          <div className="flex items-center justify-between py-2">
            <Label htmlFor="is_smoker" className="text-sm font-medium">Do you smoke?</Label>
            <Switch
              id="is_smoker"
              checked={formData.is_smoker || false}
              onCheckedChange={(checked) => setFormData({...formData, is_smoker: checked})}
            />
          </div>
          
          <div>
            <Label htmlFor="additional_notes">Additional Notes</Label>
            <Textarea
              id="additional_notes"
              value={formData.additional_notes || ''}
              onChange={(e) => setFormData({...formData, additional_notes: e.target.value})}
              placeholder="Any additional information you'd like to share with landlords"
              rows={4}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}