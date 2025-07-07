import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { User } from 'lucide-react'
import { TenantProfile } from '@/types/profile'

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
  // Parse current address into components
  const parseAddress = (address: string) => {
    if (!address) return { line1: '', line2: '', city: '', postcode: '' }
    
    const parts = address.split(',').map(part => part.trim())
    return {
      line1: parts[0] || '',
      line2: parts[1] || '',
      city: parts[2] || '',
      postcode: parts[3] || ''
    }
  }

  const [addressComponents, setAddressComponents] = useState(parseAddress(formData.current_address || ''))

  // Update formData when address components change
  useEffect(() => {
    const addressParts = [
      addressComponents.line1,
      addressComponents.line2,
      addressComponents.city,
      addressComponents.postcode
    ].filter(part => part.trim() !== '')
    
    const fullAddress = addressParts.join(', ')
    if (fullAddress !== formData.current_address) {
      setFormData({...formData, current_address: fullAddress})
    }
  }, [addressComponents])

  // Update address components when formData changes (from external sources)
  useEffect(() => {
    const parsed = parseAddress(formData.current_address || '')
    setAddressComponents(parsed)
  }, [formData.current_address])

  const updateAddressComponent = (field: string, value: string) => {
    setAddressComponents(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
      </CardContent>
    </Card>
  )
}