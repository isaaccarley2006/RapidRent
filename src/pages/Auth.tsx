
import React, { useState } from 'react'
import { Navigation } from '@/components/home/Navigation'
import { Footer } from '@/components/home/Footer'
import { EnhancedAuthForm } from '@/components/auth/EnhancedAuthForm'
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

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-md">
          <EnhancedAuthForm mode={authMode} onToggleMode={toggleAuthMode} />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default Auth
