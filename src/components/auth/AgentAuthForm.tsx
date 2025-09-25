import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AuthModeToggle } from './AuthModeToggle'
import { StepNavigation } from './StepNavigation'
import { OAuthButtons } from './OAuthButtons'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

// Comprehensive schemas for agent flow
const baseStep1Schema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
})

const step1Schema = baseStep1Schema.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

const step2Schema = z.object({
  nationality: z.string().min(1, 'Please select your nationality'),
  visaType: z.string().optional()
})

const step3Schema = z.object({
  idVerification: z.boolean().refine(val => val === true, {
    message: "ID verification is required for agents"
  })
})

const signUpSchema = baseStep1Schema.merge(step2Schema).merge(step3Schema).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
})

type SignUpFormData = z.infer<typeof signUpSchema>
type SignInFormData = z.infer<typeof signInSchema>

interface AgentAuthFormProps {
  mode: 'signin' | 'signup'
  onToggleMode: () => void
  currentStep: number
  onStepChange: (step: number) => void
}

const nationalities = [
  'British', 'Irish', 'American', 'Canadian', 'Australian', 'German', 'French', 'Spanish', 'Italian', 'Dutch',
  'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish', 'Czech', 'Hungarian', 'Romanian', 'Bulgarian',
  'Greek', 'Portuguese', 'Belgian', 'Austrian', 'Swiss', 'Other'
]

const visaTypes = [
  'UK Visa', 'EU Settlement Scheme', 'Tier 2 (General)', 'Tier 1 (Entrepreneur)', 'Student Visa',
  'Tourist Visa', 'Working Holiday Visa', 'Family Visa', 'Other'
]

export const AgentAuthForm: React.FC<AgentAuthFormProps> = ({
  mode,
  onToggleMode,
  currentStep,
  onStepChange
}) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange'
  })

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange'
  })

  const validateCurrentStep = async () => {
    if (mode === 'signin') return true
    
    if (currentStep === 1) {
      return await signUpForm.trigger(['fullName', 'email', 'phone', 'password', 'confirmPassword'])
    } else if (currentStep === 2) {
      return await signUpForm.trigger(['nationality', 'visaType'])
    } else if (currentStep === 3) {
      return await signUpForm.trigger(['idVerification'])
    }
    
    return true
  }

  const handleNextStep = async () => {
    if (currentStep < 3) {
      const isValid = await validateCurrentStep()
      if (isValid) {
        onStepChange(currentStep + 1)
      }
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1)
    }
  }

  const onSignUp = async (data: SignUpFormData) => {
    try {
      setLoading(true)
      
      const redirectUrl = `${window.location.origin}/`
      
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: data.fullName,
            phone: data.phone,
            role: 'agent',
            nationality: data.nationality,
            visa_type: data.visaType
          }
        }
      })

      if (error) {
        if (error.message.includes('User already registered')) {
          toast.error('An account with this email already exists. Please sign in instead.')
          onToggleMode()
          return
        }
        throw error
      }

      toast.success('Account created! Please check your email to verify your account.')
      navigate('/agent/dashboard')
    } catch (error: any) {
      console.error('Signup error:', error)
      toast.error(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const onSignIn = async (data: SignInFormData) => {
    try {
      setLoading(true)
      
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password. Please check your credentials.')
          return
        }
        throw error
      }

      toast.success('Welcome back!')
      navigate('/agent/dashboard')
    } catch (error: any) {
      console.error('Signin error:', error)
      toast.error(error.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = async () => {
    if (mode === 'signin') {
      const isValid = await signInForm.trigger()
      if (isValid) {
        await onSignIn(signInForm.getValues())
      }
    } else {
      await onSignUp(signUpForm.getValues())
    }
  }

  const handleButtonClick = async () => {
    if (mode === 'signin' || currentStep === 3) {
      await handleFormSubmit()
    } else {
      await handleNextStep()
    }
  }

  const getButtonText = () => {
    if (loading) return 'Loading...'
    if (mode === 'signin') return 'Sign In'
    if (currentStep === 3) return 'Create Agent Account'
    return 'Continue'
  }

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-text-primary font-medium">Full Name</Label>
        <Input
          {...signUpForm.register('fullName')}
          placeholder="Enter your full name"
          className="h-12 border-muted focus:border-primary focus:ring-primary"
        />
        {signUpForm.formState.errors.fullName && (
          <p className="text-sm text-destructive">{signUpForm.formState.errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-text-primary font-medium">Email Address</Label>
        <Input
          {...signUpForm.register('email')}
          type="email"
          placeholder="Enter your email"
          className="h-12 border-muted focus:border-primary focus:ring-primary"
        />
        {signUpForm.formState.errors.email && (
          <p className="text-sm text-destructive">{signUpForm.formState.errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-text-primary font-medium">Phone Number</Label>
        <Input
          {...signUpForm.register('phone')}
          type="tel"
          placeholder="Enter your phone number"
          className="h-12 border-muted focus:border-primary focus:ring-primary"
        />
        {signUpForm.formState.errors.phone && (
          <p className="text-sm text-destructive">{signUpForm.formState.errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-text-primary font-medium">Password</Label>
        <Input
          {...signUpForm.register('password')}
          type="password"
          placeholder="Create a password"
          className="h-12 border-muted focus:border-primary focus:ring-primary"
        />
        {signUpForm.formState.errors.password && (
          <p className="text-sm text-destructive">{signUpForm.formState.errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-text-primary font-medium">Confirm Password</Label>
        <Input
          {...signUpForm.register('confirmPassword')}
          type="password"
          placeholder="Confirm your password"
          className="h-12 border-muted focus:border-primary focus:ring-primary"
        />
        {signUpForm.formState.errors.confirmPassword && (
          <p className="text-sm text-destructive">{signUpForm.formState.errors.confirmPassword.message}</p>
        )}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Professional Information
      </h3>
      
      <div className="space-y-2">
        <Label className="text-text-primary font-medium">Nationality</Label>
        <Controller
          name="nationality"
          control={signUpForm.control}
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
        {signUpForm.formState.errors.nationality && (
          <p className="text-sm text-destructive">{signUpForm.formState.errors.nationality.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-text-primary font-medium">Visa Type (if applicable)</Label>
        <Controller
          name="visaType"
          control={signUpForm.control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="h-12 border-muted focus:border-primary focus:ring-primary">
                <SelectValue placeholder="Select visa type (optional)" />
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
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="text-center space-y-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-text-primary mb-2">Identity Verification Required</h3>
        <p className="text-text-muted">
          As an agent, you must complete identity verification to ensure platform security and compliance.
        </p>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Identity verification will be completed after account creation through our secure verification partner.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...signUpForm.register('idVerification')}
          className="w-4 h-4 text-primary border-muted rounded focus:ring-primary"
        />
        <label className="text-sm text-text-primary">
          I agree to complete identity verification after account creation
        </label>
      </div>
      {signUpForm.formState.errors.idVerification && (
        <p className="text-sm text-destructive">{signUpForm.formState.errors.idVerification.message}</p>
      )}
    </div>
  )

  const renderSignIn = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-text-primary font-medium">Email Address</Label>
        <Input
          {...signInForm.register('email')}
          type="email"
          placeholder="Enter your email"
          className="h-12 border-muted focus:border-primary focus:ring-primary"
        />
        {signInForm.formState.errors.email && (
          <p className="text-sm text-destructive">{signInForm.formState.errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-text-primary font-medium">Password</Label>
        <Input
          {...signInForm.register('password')}
          type="password"
          placeholder="Enter your password"
          className="h-12 border-muted focus:border-primary focus:ring-primary"
        />
        {signInForm.formState.errors.password && (
          <p className="text-sm text-destructive">{signInForm.formState.errors.password.message}</p>
        )}
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    if (mode === 'signin') return renderSignIn()
    if (currentStep === 1) return renderStep1()
    if (currentStep === 2) return renderStep2()
    if (currentStep === 3) return renderStep3()
    return null
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8 text-center">
        <AuthModeToggle mode={mode} onToggle={onToggleMode} />
      </div>

      {mode === 'signup' && (
        <StepNavigation
          currentStep={currentStep}
          totalSteps={3}
          onPrevStep={handlePrevStep}
          canGoBack={currentStep > 1}
        />
      )}

      <form className="space-y-6">
        {renderCurrentStep()}

        <Button
          type="button"
          onClick={handleButtonClick}
          disabled={loading}
          className="w-full h-12 bg-accent hover:bg-accent-dark text-white text-lg font-medium rounded-xl"
        >
          {getButtonText()}
        </Button>

        {mode === 'signin' && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-text-muted">Or continue with</span>
              </div>
            </div>

            <OAuthButtons />
          </>
        )}
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onToggleMode}
          className="text-sm text-text-muted hover:text-accent transition-colors"
        >
          {mode === 'signin' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  )
}