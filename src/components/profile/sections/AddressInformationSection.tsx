import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TenantProfile } from '@/types/profile'
import { useAddressComponents } from '@/hooks/useAddressComponents'

interface AddressInformationSectionProps {
  formData: Partial<TenantProfile>
  setFormData: (data: Partial<TenantProfile>) => void
}

export const AddressInformationSection: React.FC<AddressInformationSectionProps> = ({
  formData,
  setFormData
}) => {
  const { addressComponents, updateAddressComponent } = useAddressComponents(formData, setFormData)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Address Information</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <Label className="text-sm font-medium">Current Address *</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                type="text"
                placeholder="Address Line 1"
                value={addressComponents.line1}
                onChange={(e) => updateAddressComponent('line1', e.target.value)}
                autoComplete="address-line1"
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="Address Line 2 (optional)"
                value={addressComponents.line2}
                onChange={(e) => updateAddressComponent('line2', e.target.value)}
                autoComplete="address-line2"
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="City"
                value={addressComponents.city}
                onChange={(e) => updateAddressComponent('city', e.target.value)}
                autoComplete="address-level2"
              />
            </div>
            <div>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  )
}