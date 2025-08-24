import React, { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useToast } from '@/hooks/use-toast'

interface OTPVerificationProps {
  email: string
  fullName: string
  onSuccess: () => void
  onBack: () => void
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  fullName,
  onSuccess,
  onBack
}) => {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the 6-digit code sent to your email.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    console.log('🔍 Attempting OTP verification for:', email)
    console.log('🔍 OTP token:', otp)
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      })

      console.log('🔍 OTP verification response:', { data: !!data, error: error?.message })

      if (error) throw error

      if (data.session) {
        console.log('✅ OTP verification successful - session created')
        toast({
          title: "Welcome to RapidRent! 🎉",
          description: "Your account has been created successfully.",
        })
        onSuccess()
      }
    } catch (error: any) {
      console.error('OTP verification error:', error)
      let errorMessage = error.message
      
      if (error.message.includes('Token has expired')) {
        errorMessage = 'The verification code has expired. Please request a new one.'
      } else if (error.message.includes('Invalid token')) {
        errorMessage = 'Invalid verification code. Please check and try again.'
      }
      
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return
    
    setResendLoading(true)
    console.log('🔄 Resending OTP for:', email)
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          data: {
            full_name: fullName
          }
        }
      })

      console.log('🔄 Resend OTP response:', { error: error?.message })

      if (error) throw error

      console.log('✅ OTP resent successfully')
      toast({
        title: "Code Sent! 📧",
        description: "A new verification code has been sent to your email.",
      })
      setResendCooldown(60)
    } catch (error: any) {
      console.error('Resend OTP error:', error)
      toast({
        title: "Failed to Resend",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setResendLoading(false)
    }
  }

  // Auto-submit when 6 digits are entered
  useEffect(() => {
    if (otp.length === 6) {
      handleVerifyOTP()
    }
  }, [otp])

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">
            Verify your email
          </h1>
          <p className="text-muted text-sm">
            We've sent a 6-digit code to
          </p>
          <p className="text-primary text-sm font-medium">
            {email}
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="text-muted text-sm font-medium block text-center">
              Enter verification code
            </Label>
            <div className="flex justify-center">
              <InputOTP 
                maxLength={6} 
                value={otp} 
                onChange={setOtp}
                disabled={loading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium rounded-xl h-11"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                'Verify Code'
              )}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-xs text-muted">
                Didn't receive the code?
              </p>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendLoading || resendCooldown > 0}
                className="text-sm text-primary hover:text-primary/80 transition-colors disabled:text-muted disabled:cursor-not-allowed"
              >
                {resendLoading ? (
                  'Sending...'
                ) : resendCooldown > 0 ? (
                  `Resend code in ${resendCooldown}s`
                ) : (
                  'Resend code'
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={onBack}
                className="text-sm text-muted hover:text-primary transition-colors"
              >
                ← Back to signup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}