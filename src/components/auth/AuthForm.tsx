
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/auth/useUser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { OTPVerification } from './OTPVerification'

interface AuthFormProps {
  mode: 'signin' | 'signup'
  onToggleMode: () => void
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onToggleMode }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [showOTPVerification, setShowOTPVerification] = useState(false)
  const { toast } = useToast()
  const { refresh } = useUser()
  const navigate = useNavigate()

  const handleSuccessfulAuth = async () => {
    // Refresh auth state to get profile
    await refresh()
    
    // Give a moment for profile to load, then redirect based on role
    setTimeout(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', session.user.id)
            .single()
          
          if (profile?.user_type === 'landlord') {
            navigate('/dashboard')
          } else if (profile?.user_type === 'tenant') {
            navigate('/dashboard')
          } else {
            // No role set, go to onboarding
            navigate('/onboarding')
          }
        }
      } catch (error) {
        console.error('Error determining redirect:', error)
        navigate('/dashboard')
      }
    }, 100)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'signup') {
        console.log('📧 Requesting OTP for signup:', email)
        
        // For signup, use OTP instead of password - explicitly request email OTP
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
            data: {
              full_name: fullName
            }
          }
        })
        
        console.log('📧 OTP request response:', { error: error?.message })
        
        if (error) throw error
        
        console.log('✅ OTP sent successfully')
        toast({
          title: "Code sent! 📧",
          description: "We've sent a 6-digit verification code to your email.",
        })
        
        setShowOTPVerification(true)
      } else {
        // For signin, keep using password
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error
        
        toast({
          title: "Welcome back! 👋",
          description: "You've been signed in successfully.",
        })
        
        await handleSuccessfulAuth()
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      let errorMessage = error.message
      
      // Provide user-friendly error messages
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.'
      } else if (error.message.includes('User already registered')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.'
      }
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTestLogin = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Try to sign in first
      let { error } = await supabase.auth.signInWithPassword({ email, password })
      
      if (error && error.message.includes('Invalid login credentials')) {
        // Account doesn't exist, create it
        const userType = email.includes('landlord') ? 'landlord' : 'tenant'
        const fullName = email.includes('landlord') ? 'Test Landlord' : 'Test Tenant'
        
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        })
        
        if (signUpError) throw signUpError
        
        if (data.user) {
          // Create profile immediately
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email,
            full_name: fullName,
            user_type: userType,
            profile_complete: true,
            phone: '+44 7700 900123'
          })
          
          // Sign in after account creation
          const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
          if (signInError) throw signInError
        }
      } else if (error) {
        throw error
      }
      
      toast({
        title: "Test login successful! 🎉",
        description: `Logged in as ${email.includes('landlord') ? 'landlord' : 'tenant'}`,
      })
      
      await handleSuccessfulAuth()
    } catch (error: any) {
      toast({
        title: "Test login failed",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSuccess = async () => {
    setShowOTPVerification(false)
    // Reset form
    setEmail('')
    setFullName('')
    
    await handleSuccessfulAuth()
  }

  const handleBackToSignup = () => {
    setShowOTPVerification(false)
  }

  // Show OTP verification screen during signup
  if (mode === 'signup' && showOTPVerification) {
    return (
      <OTPVerification
        email={email}
        fullName={fullName}
        onSuccess={handleOTPSuccess}
        onBack={handleBackToSignup}
      />
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-muted text-sm">
            {mode === 'signin' 
              ? 'Sign in to continue to RapidRent' 
              : 'Join RapidRent to get started'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-muted text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-white border-gray-300 rounded-xl h-11"
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-muted text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border-gray-300 rounded-xl h-11"
              placeholder="Enter your email"
              required
            />
          </div>

          {mode === 'signin' && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-muted text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border-gray-300 rounded-xl h-11"
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium rounded-xl h-11"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {mode === 'signin' ? 'Signing in...' : 'Sending code...'}
              </div>
            ) : (
              mode === 'signin' ? 'Sign in' : 'Send verification code'
            )}
          </Button>

          {/* Quick test login buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <p className="text-center text-xs text-muted">Quick test login:</p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => handleTestLogin('landlord@test.com', 'password123')}
              >
                👨‍💼 Landlord
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => handleTestLogin('tenant@test.com', 'password123')}
              >
                🏠 Tenant
              </Button>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={onToggleMode}
              className="text-sm text-muted hover:text-primary transition-colors"
            >
              {mode === 'signin' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
