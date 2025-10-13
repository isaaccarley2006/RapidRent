import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { AuthModeToggle } from './AuthModeToggle'
import { StepNavigation } from './StepNavigation'
import { OAuthButtons } from './OAuthButtons'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

// Simplified schemas for tenant flow
const step1Schema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
})

type Step1FormData = z.infer<typeof step1Schema>
type SignInFormData = z.infer<typeof signInSchema>

interface TenantAuthFormProps {
  mode: 'signin' | 'signup'
  onToggleMode: () => void
  currentStep: number
  onStepChange: (step: number) => void
}

export const TenantAuthForm: React.FC<TenantAuthFormProps> = ({
  mode,
  onToggleMode,
  currentStep,
  onStepChange
}) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const signUpForm = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    mode: 'onChange'
  })

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange'
  })

  const validateCurrentStep = async () => {
    if (mode === 'signin') return true
    
    if (currentStep === 1) {
      return await signUpForm.trigger()
    }
    
    return true
  }

  const handleNextStep = async () => {
    if (currentStep < 2) {
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

  const onSignUp = async (data: Step1FormData) => {
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
            role: 'tenant'
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
      navigate('/dashboard')
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
      navigate('/dashboard')
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
    if (mode === 'signin' || currentStep === 2) {
      await handleFormSubmit()
    } else {
      await handleNextStep()
    }
  }

  const getButtonText = () => {
    if (loading) return 'Loading...'
    if (mode === 'signin') return 'Sign In'
    if (currentStep === 2) return 'Create Account'
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
    <div className="text-center space-y-4">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-text-primary mb-2">You're all set!</h3>
        <p className="text-text-muted">
          Your tenant account is ready. Click below to create your account and start browsing properties.
        </p>
      </div>
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
          totalSteps={2}
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
          className="w-full h-12 bg-primary hover:bg-primary-dark text-white text-lg font-medium rounded-xl"
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
          className="text-sm text-text-muted hover:text-primary transition-colors"
        >
          {mode === 'signin' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  )
}