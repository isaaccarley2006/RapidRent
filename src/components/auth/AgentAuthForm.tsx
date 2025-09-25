import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { AuthModeToggle } from './AuthModeToggle'
import { StepNavigation } from './StepNavigation'
import { OAuthButtons } from './OAuthButtons'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

// Business-focused schemas for agent signup
const baseStep1Schema = z.object({
  agencyName: z.string().min(2, 'Agency name must be at least 2 characters'),
  legalCompanyName: z.string().min(2, 'Legal company name must be at least 2 characters'),
  companyRegistrationNumber: z.string().optional(),
  isSoleTrader: z.boolean().default(false),
  primaryContactName: z.string().min(2, 'Contact name must be at least 2 characters'),
  primaryContactEmail: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
})

const step1Schema = baseStep1Schema.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

const step2Schema = z.object({
  branchAddress: z.string().min(10, 'Please enter a complete branch address'),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
})

const signUpSchema = baseStep1Schema.merge(step2Schema).refine((data) => data.password === data.confirmPassword, {
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

// No longer needed - removed nationality/visa fields for business signup

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
      return await signUpForm.trigger(['agencyName', 'legalCompanyName', 'primaryContactName', 'primaryContactEmail', 'password', 'confirmPassword'])
    } else if (currentStep === 2) {
      return await signUpForm.trigger(['branchAddress', 'termsAccepted'])
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

  const onSignUp = async (data: SignUpFormData) => {
    try {
      setLoading(true)
      
      const redirectUrl = `${window.location.origin}/dashboard`
      
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.primaryContactEmail,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: data.primaryContactName,
            role: 'agent'
          }
        }
      })

      if (authError) {
        if (authError.message.includes('User already registered')) {
          toast.error('An account with this email already exists. Please sign in instead.')
          onToggleMode()
          return
        }
        throw authError
      }

      // If user is created, create agent profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .rpc('create_agent_profile', {
            p_user_id: authData.user.id,
            p_agency_name: data.agencyName,
            p_legal_company_name: data.legalCompanyName,
            p_primary_contact_name: data.primaryContactName,
            p_primary_contact_email: data.primaryContactEmail,
            p_branch_address: data.branchAddress,
            p_company_registration_number: data.companyRegistrationNumber || null,
            p_is_sole_trader: data.isSoleTrader,
            p_terms_accepted: data.termsAccepted
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          // Don't fail the signup for profile errors - user can complete later
        }
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
    if (mode === 'signin' || currentStep === 2) {
      await handleFormSubmit()
    } else {
      await handleNextStep()
    }
  }

  const getButtonText = () => {
    if (loading) return 'Loading...'
    if (mode === 'signin') return 'Sign In'
    if (currentStep === 2) return 'Create Agent Account'
    return 'Continue'
  }

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Business Information
      </h3>

      <div className="space-y-2">
        <Label className="text-text-primary font-medium">Agency Name (Trading Name)</Label>
        <Input
          {...signUpForm.register('agencyName')}
          placeholder="e.g. Smith Properties"
          className="h-12 border-muted focus:border-primary focus:ring-primary"
        />
        {signUpForm.formState.errors.agencyName && (
          <p className="text-sm text-destructive">{signUpForm.formState.errors.agencyName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-text-primary font-medium">Legal Company Name</Label>
        <Input
          {...signUpForm.register('legalCompanyName')}
          placeholder="e.g. Smith Properties Ltd"
          className="h-12 border-muted focus:border-primary focus:ring-primary"
        />
        {signUpForm.formState.errors.legalCompanyName && (
          <p className="text-sm text-destructive">{signUpForm.formState.errors.legalCompanyName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2 mb-2">
          <Controller
            name="isSoleTrader"
            control={signUpForm.control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                id="sole-trader"
              />
            )}
          />
          <Label htmlFor="sole-trader" className="text-sm text-text-primary">I am a sole trader</Label>
        </div>
        
        {!signUpForm.watch('isSoleTrader') && (
          <>
            <Label className="text-text-primary font-medium">Company Registration Number</Label>
            <Input
              {...signUpForm.register('companyRegistrationNumber')}
              placeholder="e.g. 12345678"
              className="h-12 border-muted focus:border-primary focus:ring-primary"
            />
          </>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-text-primary font-medium">Primary Contact Name</Label>
        <Input
          {...signUpForm.register('primaryContactName')}
          placeholder="Enter your full name"
          className="h-12 border-muted focus:border-primary focus:ring-primary"
        />
        {signUpForm.formState.errors.primaryContactName && (
          <p className="text-sm text-destructive">{signUpForm.formState.errors.primaryContactName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-text-primary font-medium">Primary Contact Email</Label>
        <Input
          {...signUpForm.register('primaryContactEmail')}
          type="email"
          placeholder="Enter your email"
          className="h-12 border-muted focus:border-primary focus:ring-primary"
        />
        {signUpForm.formState.errors.primaryContactEmail && (
          <p className="text-sm text-destructive">{signUpForm.formState.errors.primaryContactEmail.message}</p>
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
        Operational Setup
      </h3>
      
      <div className="space-y-2">
        <Label className="text-text-primary font-medium">Branch Address (Main Office)</Label>
        <Input
          {...signUpForm.register('branchAddress')}
          placeholder="Enter your main office address"
          className="h-12 border-muted focus:border-primary focus:ring-primary"
        />
        {signUpForm.formState.errors.branchAddress && (
          <p className="text-sm text-destructive">{signUpForm.formState.errors.branchAddress.message}</p>
        )}
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h4 className="font-medium text-orange-900 mb-2">What happens next?</h4>
        <ul className="text-sm text-orange-800 space-y-1">
          <li>• Instant account creation with basic dashboard access</li>
          <li>• Profile completion wizard for VAT, compliance details, and branding</li>
          <li>• Property listings enabled after profile completion</li>
        </ul>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Controller
            name="termsAccepted"
            control={signUpForm.control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                id="terms-accepted"
                className="mt-1"
              />
            )}
          />
          <div>
            <Label htmlFor="terms-accepted" className="text-sm text-text-primary cursor-pointer">
              I accept the RapidRent Terms & Conditions, including:
            </Label>
            <ul className="text-xs text-text-muted mt-1 space-y-1">
              <li>• Success-only fee structure</li>
              <li>• Data handling and GDPR compliance</li>
              <li>• Platform usage policies</li>
            </ul>
          </div>
        </div>
        {signUpForm.formState.errors.termsAccepted && (
          <p className="text-sm text-destructive">{signUpForm.formState.errors.termsAccepted.message}</p>
        )}
      </div>
    </div>
  )

  // Removed Step 3 - now only 2 steps for quick signup

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
          className="w-full h-12 bg-primary hover:bg-primary-dark text-white text-lg font-medium rounded-xl transition-colors"
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