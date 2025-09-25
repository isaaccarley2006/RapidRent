import React from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Controller } from 'react-hook-form'

interface RoleIdentityStepProps {
  control: any
  errors: any
}

const nationalities = [
  'British', 'Irish', 'American', 'Canadian', 'Australian', 'German', 'French', 'Italian', 'Spanish', 'Other'
]

const visaTypes = [
  'British Citizen', 'EU Settled Status', 'EU Pre-settled Status', 'Student Visa', 'Work Visa', 'Family Visa', 'Other'
]

export const RoleIdentityStep: React.FC<RoleIdentityStepProps> = ({ control, errors }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-text-primary font-medium">
          I am a...
        </Label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="h-12 border-muted focus:border-primary focus:ring-primary">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent className="bg-background border-muted z-50">
                <SelectItem value="tenant">Tenant - Looking for a property</SelectItem>
                <SelectItem value="agent">Agent - Managing properties</SelectItem>
                <SelectItem value="landlord">Landlord - Renting out property</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.role && (
          <p className="text-sm text-destructive">{errors.role.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-text-primary font-medium">
          Nationality
        </Label>
        <Controller
          name="nationality"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="h-12 border-muted focus:border-primary focus:ring-primary">
                <SelectValue placeholder="Select your nationality" />
              </SelectTrigger>
              <SelectContent className="bg-background border-muted z-50">
                {nationalities.map((nationality) => (
                  <SelectItem key={nationality} value={nationality}>
                    {nationality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.nationality && (
          <p className="text-sm text-destructive">{errors.nationality.message}</p>
        )}
      </div>

      <div className="space-y-2">
          <Label className="text-text-primary font-medium">
            Visa Type
          </Label>
        <Controller
          name="visaType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="h-12 border-muted focus:border-primary focus:ring-primary">
                <SelectValue placeholder="Select your visa type" />
              </SelectTrigger>
              <SelectContent className="bg-background border-muted z-50">
                {visaTypes.map((visaType) => (
                  <SelectItem key={visaType} value={visaType}>
                    {visaType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.visaType && (
          <p className="text-sm text-destructive">{errors.visaType.message}</p>
        )}
      </div>
    </div>
  )
}