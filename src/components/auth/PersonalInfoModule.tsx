import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PersonalInfoModuleProps {
  register: any
  errors: any
  mode: 'signin' | 'signup'
}

export const PersonalInfoModule: React.FC<PersonalInfoModuleProps> = ({ register, errors, mode }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        {mode === 'signin' ? 'Sign in to your account' : 'Personal Information'}
      </h3>
      
      <div className="space-y-4">
        {mode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-text-primary font-medium">
              Full Name
            </Label>
            <Input
              id="fullName"
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
          <Label htmlFor="email" className="text-text-primary font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="Enter your email"
            className="h-12 border-muted focus:border-primary focus:ring-primary"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-text-primary font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            {...register('password')}
            placeholder="Enter your password"
            className="h-12 border-muted focus:border-primary focus:ring-primary"
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        {mode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-text-primary font-medium">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              placeholder="Confirm your password"
              className="h-12 border-muted focus:border-primary focus:ring-primary"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}