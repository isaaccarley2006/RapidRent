
import React, { useState } from 'react'
import { AppLayout } from '@/components/layouts/AppLayout'
import { useAuthRedirect } from '@/hooks/useAuthRedirect'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'

const Onboarding: React.FC = () => {
  const { loading, user } = useAuthRedirect()
  const { toast } = useToast()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [userType, setUserType] = useState<'tenant' | 'landlord'>('tenant')
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return <LoadingSpinner />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setSubmitting(true)
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone,
          user_type: userType,
          profile_complete: true
        })
        .eq('id', user.id)
      
      if (error) throw error
      
      toast({
        title: "Profile completed! 🎉",
        description: "Welcome to RentView!"
      })
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-lg mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-primary mb-2">
                Complete your profile 🎯
              </h1>
              <p className="text-muted text-sm">
                Just a few details to get you started
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  className="bg-gray-50 border-gray-300 rounded-xl h-11 text-muted"
                  disabled
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-muted text-sm font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white border-gray-300 rounded-xl h-11"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label className="text-muted text-sm font-medium">
                  I am a:
                </Label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setUserType('tenant')}
                    className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
                      userType === 'tenant'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-300 bg-white text-muted hover:border-primary/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg mb-1">🏠</div>
                      <div className="font-medium text-sm">Tenant</div>
                      <div className="text-xs opacity-75">Looking for property</div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setUserType('landlord')}
                    className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
                      userType === 'landlord'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-300 bg-white text-muted hover:border-primary/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg mb-1">🏢</div>
                      <div className="font-medium text-sm">Landlord</div>
                      <div className="text-xs opacity-75">Renting property</div>
                    </div>
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium rounded-xl h-11"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Completing profile...
                  </div>
                ) : (
                  'Complete Profile ✅'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default Onboarding
