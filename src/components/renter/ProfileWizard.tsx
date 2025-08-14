import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Check, User, Briefcase, Home, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { renterProfileWizardSchema, RenterProfileWizardFormData } from '@/schemas/renter'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { track } from '@/lib/analytics'
import { useUser } from '@/lib/auth/useUser'

interface ProfileWizardProps {
  onSubmit: (data: RenterProfileWizardFormData) => Promise<boolean>
  onCancel: () => void
  saving: boolean
}

const STEPS = [
  { id: 1, title: 'Basic Information', icon: User },
  { id: 2, title: 'Income & Employment', icon: Briefcase },
  { id: 3, title: 'Rental Preferences', icon: Home },
  { id: 4, title: 'Emergency Contact', icon: Phone },
]

export const ProfileWizard: React.FC<ProfileWizardProps> = ({
  onSubmit,
  onCancel,
  saving
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [hasTrackedStart, setHasTrackedStart] = useState(false)
  const { user, profile } = useUser()
  
  const form = useForm<RenterProfileWizardFormData>({
    resolver: zodResolver(renterProfileWizardSchema),
    mode: 'onChange'
  })

  const { register, watch, setValue, trigger, handleSubmit, formState: { errors } } = form
  const watchedValues = watch()

  // Track profile start on first render
  useEffect(() => {
    if (!hasTrackedStart) {
      track('profile_started', {
        user_id: user?.id,
        role: profile?.role
      })
      setHasTrackedStart(true)
    }
  }, [hasTrackedStart, user?.id, profile?.role])

  const nextStep = async () => {
    const isValid = await trigger()
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onFormSubmit = async (data: RenterProfileWizardFormData) => {
    const success = await onSubmit(data)
    if (success) {
      track('profile_completed', {
        user_id: user?.id,
        role: profile?.role
      })
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  {...register('full_name')}
                  placeholder="Enter your full legal name"
                />
                {errors.full_name && (
                  <p className="text-sm text-red-600 mt-1">{errors.full_name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="date_of_birth">Date of Birth *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  {...register('date_of_birth')}
                />
                {errors.date_of_birth && (
                  <p className="text-sm text-red-600 mt-1">{errors.date_of_birth.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="time_at_current_address">Time at Current Address *</Label>
                <Select onValueChange={(value) => setValue('time_at_current_address', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-than-6-months">Less than 6 months</SelectItem>
                    <SelectItem value="6-months-to-1-year">6 months to 1 year</SelectItem>
                    <SelectItem value="1-to-2-years">1 to 2 years</SelectItem>
                    <SelectItem value="2-to-5-years">2 to 5 years</SelectItem>
                    <SelectItem value="more-than-5-years">More than 5 years</SelectItem>
                  </SelectContent>
                </Select>
                {errors.time_at_current_address && (
                  <p className="text-sm text-red-600 mt-1">{errors.time_at_current_address.message}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="current_address">Current Address *</Label>
              <Textarea
                id="current_address"
                {...register('current_address')}
                placeholder="Enter your current full address"
                rows={3}
              />
              {errors.current_address && (
                <p className="text-sm text-red-600 mt-1">{errors.current_address.message}</p>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="employment_status">Employment Status *</Label>
                <Select onValueChange={(value) => setValue('employment_status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed Full-time</SelectItem>
                    <SelectItem value="self-employed">Self-employed</SelectItem>
                    <SelectItem value="contract">Contract Worker</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
                {errors.employment_status && (
                  <p className="text-sm text-red-600 mt-1">{errors.employment_status.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="annual_income">Annual Income (£) *</Label>
                <Input
                  id="annual_income"
                  type="number"
                  {...register('annual_income', { valueAsNumber: true })}
                  placeholder="e.g. 35000"
                />
                {errors.annual_income && (
                  <p className="text-sm text-red-600 mt-1">{errors.annual_income.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="employer_name">Employer Name *</Label>
                <Input
                  id="employer_name"
                  {...register('employer_name')}
                  placeholder="Enter your employer name"
                />
                {errors.employer_name && (
                  <p className="text-sm text-red-600 mt-1">{errors.employer_name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="job_title">Job Title *</Label>
                <Input
                  id="job_title"
                  {...register('job_title')}
                  placeholder="Enter your job title"
                />
                {errors.job_title && (
                  <p className="text-sm text-red-600 mt-1">{errors.job_title.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="employment_start_date">Employment Start Date *</Label>
                <Input
                  id="employment_start_date"
                  type="date"
                  {...register('employment_start_date')}
                />
                {errors.employment_start_date && (
                  <p className="text-sm text-red-600 mt-1">{errors.employment_start_date.message}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="number_of_occupants">Number of Occupants *</Label>
                <Input
                  id="number_of_occupants"
                  type="number"
                  min="1"
                  {...register('number_of_occupants', { valueAsNumber: true })}
                  placeholder="e.g. 2"
                />
                {errors.number_of_occupants && (
                  <p className="text-sm text-red-600 mt-1">{errors.number_of_occupants.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="max_budget">Maximum Budget (£/month) *</Label>
                <Input
                  id="max_budget"
                  type="number"
                  {...register('max_budget', { valueAsNumber: true })}
                  placeholder="e.g. 1500"
                />
                {errors.max_budget && (
                  <p className="text-sm text-red-600 mt-1">{errors.max_budget.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="target_move_in_date">Target Move-in Date *</Label>
                <Input
                  id="target_move_in_date"
                  type="date"
                  {...register('target_move_in_date')}
                />
                {errors.target_move_in_date && (
                  <p className="text-sm text-red-600 mt-1">{errors.target_move_in_date.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="has_pets">Do you have pets?</Label>
                <Switch
                  id="has_pets"
                  checked={watchedValues.has_pets}
                  onCheckedChange={(checked) => setValue('has_pets', checked)}
                />
              </div>
              
              {watchedValues.has_pets && (
                <div>
                  <Label htmlFor="pet_details">Pet Details</Label>
                  <Textarea
                    id="pet_details"
                    {...register('pet_details')}
                    placeholder="Describe your pets (type, breed, age, etc.)"
                    rows={3}
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <Label htmlFor="is_smoker">Do you smoke?</Label>
                <Switch
                  id="is_smoker"
                  checked={watchedValues.is_smoker}
                  onCheckedChange={(checked) => setValue('is_smoker', checked)}
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="emergency_contact_name">Emergency Contact Name *</Label>
                <Input
                  id="emergency_contact_name"
                  {...register('emergency_contact_name')}
                  placeholder="Enter emergency contact name"
                />
                {errors.emergency_contact_name && (
                  <p className="text-sm text-red-600 mt-1">{errors.emergency_contact_name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="emergency_contact_phone">Emergency Contact Phone *</Label>
                <Input
                  id="emergency_contact_phone"
                  {...register('emergency_contact_phone')}
                  placeholder="Enter emergency contact phone"
                />
                {errors.emergency_contact_phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.emergency_contact_phone.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="emergency_contact_relationship">Relationship *</Label>
                <Select onValueChange={(value) => setValue('emergency_contact_relationship', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="spouse">Spouse/Partner</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.emergency_contact_relationship && (
                  <p className="text-sm text-red-600 mt-1">{errors.emergency_contact_relationship.message}</p>
                )}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon
            const isCompleted = currentStep > step.id
            const isCurrent = currentStep === step.id
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isCompleted 
                    ? 'bg-primary border-primary text-white' 
                    : isCurrent 
                    ? 'border-primary text-primary bg-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isCurrent ? 'text-primary' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < STEPS.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    isCompleted ? 'bg-primary' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            Step {currentStep}: {STEPS[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            {renderStep()}
            
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={currentStep === 1 ? onCancel : prevStep}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {currentStep === 1 ? 'Cancel' : 'Previous'}
              </Button>
              
              {currentStep < STEPS.length ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={saving}>
                  {saving ? <LoadingSpinner /> : 'Complete Profile'}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}