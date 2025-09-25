import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { AuthModeToggle } from '@/components/auth/AuthModeToggle'
import { StepNavigation } from '@/components/auth/StepNavigation'
import { PersonalDetailsStep } from '@/components/auth/PersonalDetailsStep'
import { RoleIdentityStep } from '@/components/auth/RoleIdentityStep'
import { VerificationStep } from '@/components/auth/VerificationStep'
import { OAuthButtons } from '@/components/auth/OAuthButtons'

// Step-specific validation schemas
const step1Schema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

const step2Schema = z.object({
  role: z.enum(['tenant', 'agent', 'landlord'], {
    required_error: 'Please select your role',
  }),
  nationality: z.string().min(1, 'Please select your nationality'),
  visaType: z.string().min(1, 'Please select your visa type'),
})

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['tenant', 'agent', 'landlord'], {
    required_error: 'Please select your role',
  }),
  nationality: z.string().min(1, 'Please select your nationality'),
  visaType: z.string().min(1, 'Please select your visa type'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type SignUpFormData = z.infer<typeof signUpSchema>
type SignInFormData = z.infer<typeof signInSchema>

interface SteppedAuthFormProps {
  mode: 'signin' | 'signup'
  onToggleMode: () => void
  currentStep: number
  onStepChange: (step: number) => void
}

export const SteppedAuthForm: React.FC<SteppedAuthFormProps> = ({ 
  mode, 
  onToggleMode, 
  currentStep, 
  onStepChange 
}) => {
  const [loading, setLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const navigate = useNavigate()
  const { toast } = useToast()

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur'
  })

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  const currentForm = mode === 'signup' ? signUpForm : signInForm

  const validateCurrentStep = async (): Promise<boolean> => {
    if (mode === 'signin') return true
    
    const currentValues = signUpForm.getValues()
    console.log('Validating step:', currentStep, 'with values:', currentValues)
    
    try {
      switch (currentStep) {
        case 1:
          await step1Schema.parseAsync({
            fullName: currentValues.fullName,
            email: currentValues.email,
            phone: currentValues.phone,
            password: currentValues.password,
            confirmPassword: currentValues.confirmPassword,
          })
          return true
        case 2:
          await step2Schema.parseAsync({
            role: currentValues.role,
            nationality: currentValues.nationality,
            visaType: currentValues.visaType,
          })
          return true
        case 3:
          // ID verification is optional, so always valid
          return true
        default:
          return true
      }
    } catch (error) {
      console.log('Validation error:', error)
      // Trigger form validation to show errors
      await signUpForm.trigger()
      return false
    }
  }

  const handleNextStep = async () => {
    const isValid = await validateCurrentStep()
    if (isValid && currentStep < 3) {
      onStepChange(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1)
    }
  }

  const onSignUp = async (data: SignUpFormData) => {
    setLoading(true)
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            user_type: data.role,
            nationality: data.nationality,
            visa_type: data.visaType,
            phone: data.phone,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      })

      if (error) throw error

      if (authData.user) {
        await supabase.from('profiles').upsert({
          id: authData.user.id,
          email: data.email,
          full_name: data.fullName,
          user_type: data.role,
          nationality: data.nationality,
          visa_type: data.visaType,
          phone: data.phone,
          profile_complete: false,
        })

        toast({
          title: "Account created successfully! 🎉",
          description: "Please check your email to verify your account.",
        })

        if (data.role === 'landlord') {
          navigate('/dashboard')
        } else if (data.role === 'tenant') {
          navigate('/profile')
        } else {
          navigate('/agent')
        }
      }
    } catch (error: any) {
      toast({
        title: "Account creation failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const onSignIn = async (data: SignInFormData) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email: data.email, 
        password: data.password 
      })
      if (error) throw error

      toast({
        title: "Welcome back! 🎉",
        description: "You've been signed in successfully.",
      })

      navigate('/dashboard')
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = async (data: any) => {
    console.log('Form submitted:', { mode, currentStep, data })
    if (mode === 'signin') {
      onSignIn(data as SignInFormData)
    } else if (currentStep === 3) {
      onSignUp(data as SignUpFormData)
    }
  }

  const handleButtonClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('Button clicked:', { mode, currentStep })
    
    if (mode === 'signin' || currentStep === 3) {
      // For signin and final step, trigger form submission
      currentForm.handleSubmit(handleFormSubmit)()
    } else {
      // For signup steps 1 and 2, handle navigation
      const isValid = await validateCurrentStep()
      console.log('Step validation result:', { currentStep, isValid, errors: currentForm.formState.errors })
      
      if (isValid) {
        onStepChange(currentStep + 1)
      } else {
        toast({
          title: "Please complete all required fields",
          description: "Check the form for any validation errors.",
          variant: "destructive",
        })
      }
    }
  }

  const renderCurrentStep = () => {
    if (mode === 'signin') {
      return (
        <PersonalDetailsStep 
          register={signInForm.register}
          errors={signInForm.formState.errors}
          mode="signin"
        />
      )
    }

    switch (currentStep) {
      case 1:
        return (
          <PersonalDetailsStep 
            register={signUpForm.register}
            errors={signUpForm.formState.errors}
            mode="signup"
          />
        )
      case 2:
        return (
          <RoleIdentityStep 
            control={signUpForm.control}
            errors={signUpForm.formState.errors}
          />
        )
      case 3:
        return (
          <VerificationStep onFilesChange={setUploadedFiles} />
        )
      default:
        return null
    }
  }

  const getButtonText = () => {
    if (mode === 'signin') {
      return loading ? 'Signing in...' : 'Sign In'
    }
    
    if (currentStep === 3) {
      return loading ? 'Creating account...' : 'Create Account'
    }
    
    return 'Next Step'
  }

  return (
    <div className="w-full max-w-lg">
      <div className="bg-background p-8 lg:p-12 space-y-8">
        <AuthModeToggle mode={mode} onToggle={onToggleMode} />
        
        {mode === 'signup' && (
          <StepNavigation 
            currentStep={currentStep}
            totalSteps={3}
            onPrevStep={handlePrevStep}
            canGoBack={currentStep > 1}
          />
        )}
        
        <form onSubmit={currentForm.handleSubmit(handleFormSubmit)} className="space-y-8">
          {renderCurrentStep()}
          
          <div className="space-y-6">
            <button
              type={mode === 'signin' || currentStep === 3 ? 'submit' : 'button'}
              onClick={mode === 'signin' || currentStep === 3 ? undefined : handleButtonClick}
              className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {getButtonText()}
            </button>

            {mode === 'signin' && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-background px-4 text-text-muted">Or continue with</span>
                  </div>
                </div>
                
                <OAuthButtons />
              </>
            )}

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={onToggleMode}
                className="text-text-muted hover:text-text-primary font-medium transition-colors"
              >
                {mode === 'signin' 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}