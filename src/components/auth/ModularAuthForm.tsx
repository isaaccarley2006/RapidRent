import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { AuthModeToggle } from '@/components/auth/AuthModeToggle'
import { PersonalInfoModule } from '@/components/auth/PersonalInfoModule'
import { RoleSelectionModule } from '@/components/auth/RoleSelectionModule'
import { IdentityInfoModule } from '@/components/auth/IdentityInfoModule'
import { IDVerificationModule } from '@/components/auth/IDVerificationModule'
import { AuthActionsModule } from '@/components/auth/AuthActionsModule'

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
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

interface ModularAuthFormProps {
  mode: 'signin' | 'signup'
  onToggleMode: () => void
}

export const ModularAuthForm: React.FC<ModularAuthFormProps> = ({ mode, onToggleMode }) => {
  const [loading, setLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const navigate = useNavigate()
  const { toast } = useToast()

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  const currentForm = mode === 'signup' ? signUpForm : signInForm

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

  const handleSubmit = (data: any) => {
    if (mode === 'signup') {
      onSignUp(data as SignUpFormData)
    } else {
      onSignIn(data as SignInFormData)
    }
  }

  return (
    <div className="w-full max-w-lg">
      <div className="bg-background p-8 lg:p-12 space-y-8">
        <AuthModeToggle mode={mode} onToggle={onToggleMode} />
        
        <form onSubmit={currentForm.handleSubmit(handleSubmit)} className="space-y-8">
          <PersonalInfoModule 
            register={currentForm.register}
            errors={currentForm.formState.errors}
            mode={mode}
          />
          
          {mode === 'signup' && (
            <>
              <RoleSelectionModule 
                setValue={signUpForm.setValue}
                errors={signUpForm.formState.errors}
              />
              
              <IdentityInfoModule 
                setValue={signUpForm.setValue}
                errors={signUpForm.formState.errors}
              />
              
              <IDVerificationModule onFilesChange={setUploadedFiles} />
            </>
          )}
          
          <AuthActionsModule 
            mode={mode}
            loading={loading}
            onToggleMode={onToggleMode}
          />
        </form>
      </div>
    </div>
  )
}