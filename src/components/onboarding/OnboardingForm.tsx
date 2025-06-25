
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface FormData {
  fullName: string
  phone: string
  userType: 'tenant' | 'landlord'
}

interface FormErrors {
  fullName?: string
  phone?: string
  userType?: string
}

export const OnboardingForm: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    userType: 'tenant'
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\+]?[\d\s\-\(\)]{10,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || isSubmitting) return
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      console.log('=== ONBOARDING FORM SUBMISSION ===')
      console.log('User ID:', user.id)
      console.log('Form data:', formData)

      // Use upsert to handle both insert and update cases
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: formData.fullName.trim(),
          phone: formData.phone.trim(),
          user_type: formData.userType,
          profile_complete: true,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })
      
      if (error) {
        console.error('Profile upsert error:', error)
        throw error
      }
      
      console.log('Profile updated successfully')
      
      toast({
        title: "Welcome to RentView! 🎉",
        description: `Your ${formData.userType} profile has been completed successfully.`
      })

      // Navigate to appropriate dashboard based on user type
      const dashboardPath = formData.userType === 'tenant' ? '/dashboard/tenant' : '/dashboard/landlord'
      console.log('Redirecting to:', dashboardPath)
      
      // Small delay to let the toast show, then redirect
      setTimeout(() => {
        navigate(dashboardPath, { replace: true })
      }, 1500)
      
    } catch (error: any) {
      console.error('Profile completion error:', error)
      toast({
        title: "Something went wrong",
        description: error.message || "Failed to complete profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Complete your profile
          </h1>
          <p className="text-gray-600 text-sm">
            Just a few details to get you started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-gray-700 text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={`bg-white border rounded-xl h-11 ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
              disabled={isSubmitting}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName}</p>
            )}
          </div>

          {/* Email (readonly) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ''}
              className="bg-gray-50 border-gray-300 rounded-xl h-11 text-gray-600"
              disabled
              readOnly
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-700 text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`bg-white border rounded-xl h-11 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your phone number"
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>

          {/* User Type */}
          <div className="space-y-3">
            <Label className="text-gray-700 text-sm font-medium">
              I am a:
            </Label>
            <RadioGroup
              value={formData.userType}
              onValueChange={(value: 'tenant' | 'landlord') => handleInputChange('userType', value)}
              className="grid grid-cols-2 gap-4"
              disabled={isSubmitting}
            >
              <div className="flex items-center space-x-2">
                <div
                  className={`flex-1 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    formData.userType === 'tenant'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-300 bg-white hover:border-primary/50'
                  }`}
                  onClick={() => !isSubmitting && handleInputChange('userType', 'tenant')}
                >
                  <div className="flex items-center justify-center mb-2">
                    <RadioGroupItem value="tenant" id="tenant" className="sr-only" />
                    <div className="text-2xl">🏠</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm text-gray-900">Tenant</div>
                    <div className="text-xs text-gray-500">Looking for property</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div
                  className={`flex-1 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    formData.userType === 'landlord'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-300 bg-white hover:border-primary/50'
                  }`}
                  onClick={() => !isSubmitting && handleInputChange('userType', 'landlord')}
                >
                  <div className="flex items-center justify-center mb-2">
                    <RadioGroupItem value="landlord" id="landlord" className="sr-only" />
                    <div className="text-2xl">🏢</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm text-gray-900">Landlord</div>
                    <div className="text-xs text-gray-500">Renting property</div>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium rounded-xl h-11"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Completing profile...
              </div>
            ) : (
              'Complete Profile'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
