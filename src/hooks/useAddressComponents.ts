import { useState, useEffect } from 'react'
import { TenantProfile } from '@/types/profile'

interface AddressComponents {
  line1: string
  line2: string
  city: string
  postcode: string
}

export const useAddressComponents = (
  formData: Partial<TenantProfile>,
  setFormData: (data: Partial<TenantProfile>) => void
) => {
  // Parse current address into components
  const parseAddress = (address: string): AddressComponents => {
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

  // Update formData when address components change, but avoid circular updates
  useEffect(() => {
    const addressParts = [
      addressComponents.line1,
      addressComponents.line2,
      addressComponents.city,
      addressComponents.postcode
    ].filter(part => part.trim() !== '')
    
    const fullAddress = addressParts.join(', ')
    // Only update if the address has actually changed to avoid circular updates
    if (fullAddress !== formData.current_address && addressParts.length > 0) {
      setFormData({...formData, current_address: fullAddress})
    }
  }, [addressComponents.line1, addressComponents.line2, addressComponents.city, addressComponents.postcode])

  // Only update address components when formData changes from external sources (not from our own updates)
  useEffect(() => {
    const parsed = parseAddress(formData.current_address || '')
    const currentAddress = [
      addressComponents.line1,
      addressComponents.line2, 
      addressComponents.city,
      addressComponents.postcode
    ].filter(part => part.trim() !== '').join(', ')
    
    // Only update if the parsed address is different from current components to avoid loops
    if (formData.current_address !== currentAddress && formData.current_address) {
      setAddressComponents(parsed)
    }
  }, [formData.current_address])

  const updateAddressComponent = (field: string, value: string) => {
    setAddressComponents(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return {
    addressComponents,
    updateAddressComponent
  }
}