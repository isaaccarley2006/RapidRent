import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface PersonalDetailsStepProps {
  register: any
  errors: any
  mode: 'signin' | 'signup'
}

export const PersonalDetailsStep: React.FC<PersonalDetailsStepProps> = ({ 
  register, 
  errors, 
  mode 
}) => {
  return (
    <div className="space-y-6">
      {mode === 'signup' && (
        <div className="space-y-2">
          <Label className="text-text-primary font-medium">
            Full Name
          </Label>
          <Input
            {...register('fullName')}
            placeholder="Enter your full name"
            className="h-12 border-muted focus:border-primary focus:ring-primary"
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName.message}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-text-primary font-medium">
          Email Address
        </Label>
        <Input
          {...register('email')}
          type="email"
          placeholder="Enter your email address"
          className="h-12 border-muted focus:border-primary focus:ring-primary"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {mode === 'signup' && (
        <div className="space-y-2">
          <Label className="text-text-primary font-medium">
            Phone Number
          </Label>
          <Input
            {...register('phone')}
            type="tel"
            placeholder="Enter your phone number"
            className="h-12 border-muted focus:border-primary focus:ring-primary"
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-text-primary font-medium">
          Password
        </Label>
        <Input
          {...register('password')}
          type="password"
          placeholder="Enter your password"
          className="h-12 border-muted focus:border-primary focus:ring-primary"
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {mode === 'signup' && (
        <div className="space-y-2">
          <Label className="text-text-primary font-medium">
            Confirm Password
          </Label>
          <Input
            {...register('confirmPassword')}
            type="password"
            placeholder="Confirm your password"
            className="h-12 border-muted focus:border-primary focus:ring-primary"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>
      )}
    </div>
  )
}