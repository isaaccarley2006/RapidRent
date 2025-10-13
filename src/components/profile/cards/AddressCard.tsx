import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin } from 'lucide-react'
import { TenantProfile } from '@/types/profile'
import { useAddressComponents } from '@/hooks/useAddressComponents'

interface AddressCardProps {
  formData: Partial<TenantProfile>
  setFormData: (data: Partial<TenantProfile>) => void
}

export const AddressCard: React.FC<AddressCardProps> = ({
  formData,
  setFormData
}) => {
  const { addressComponents, updateAddressComponent } = useAddressComponents(formData, setFormData)
  
  const completedFields = [
    addressComponents.line1,
    addressComponents.city,
    addressComponents.postcode,
    formData.time_at_current_address
  ].filter(Boolean).length

  const totalFields = 4
  const completionPercentage = Math.round((completedFields / totalFields) * 100)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            Address Information
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-sm text-muted-foreground">{completionPercentage}% complete</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Current Address *</Label>
            <div className="grid grid-cols-1 gap-3 mt-2">
              <Input
                type="text"
                placeholder="Address Line 1"
                value={addressComponents.line1}
                onChange={(e) => updateAddressComponent('line1', e.target.value)}
                autoComplete="address-line1"
              />
              <Input
                type="text"
                placeholder="Address Line 2 (optional)"
                value={addressComponents.line2}
                onChange={(e) => updateAddressComponent('line2', e.target.value)}
                autoComplete="address-line2"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  placeholder="City"
                  value={addressComponents.city}
                  onChange={(e) => updateAddressComponent('city', e.target.value)}
                  autoComplete="address-level2"
                />
                <Input
                  type="text"
                  placeholder="Postcode"
                  value={addressComponents.postcode}
                  onChange={(e) => updateAddressComponent('postcode', e.target.value)}
                  autoComplete="postal-code"
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="time_at_current_address">Time at Current Address</Label>
            <Select 
              value={formData.time_at_current_address || ''} 
              onValueChange={(value) => setFormData({...formData, time_at_current_address: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="less-than-6-months">Less than 6 months</SelectItem>
                <SelectItem value="6-12-months">6-12 months</SelectItem>
                <SelectItem value="1-2-years">1-2 years</SelectItem>
                <SelectItem value="2-5-years">2-5 years</SelectItem>
                <SelectItem value="more-than-5-years">More than 5 years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="previous_address">Previous Address</Label>
            <Textarea
              id="previous_address"
              value={formData.previous_address || ''}
              onChange={(e) => setFormData({...formData, previous_address: e.target.value})}
              placeholder="Enter your previous address (if applicable)"
              rows={3}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}