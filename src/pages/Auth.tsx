
import React, { useState } from 'react'
import { Navigation } from '@/components/home/Navigation'
import { Footer } from '@/components/home/Footer'
import { AuthBrandColumn } from '@/components/auth/AuthBrandColumn'
import { ModularAuthForm } from '@/components/auth/ModularAuthForm'
import { useAuthRedirect } from '@/hooks/useAuthRedirect'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

const Auth: React.FC = () => {
  const { loading } = useAuthRedirect()
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')

  if (loading) {
    return <LoadingSpinner />
  }

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
  }

  // Calculate progress for signup
  const currentStep = 1
  const totalSteps = authMode === 'signup' ? 4 : 1

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <div className="min-h-full grid lg:grid-cols-2">
          <AuthBrandColumn 
            currentStep={currentStep}
            totalSteps={totalSteps}
            mode={authMode}
          />
          
          <div className="flex items-center justify-center p-6 lg:p-8">
            <ModularAuthForm mode={authMode} onToggleMode={toggleAuthMode} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default Auth
