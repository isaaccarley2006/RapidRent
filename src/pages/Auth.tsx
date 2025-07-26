
import React, { useState } from 'react'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import { AuthForm } from '@/components/auth/AuthForm'
import { useAuthRedirect } from '@/hooks/useAuthRedirect'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { AppLayout } from '@/components/layouts/AppLayout'
import { TestEmailButton } from '@/components/TestEmailButton'

const Auth: React.FC = () => {
  const { loading } = useAuthRedirect()
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  if (loading) {
    return <LoadingSpinner />
  }

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
  }

  return (
    <AppLayout showNavigation={false}>
      <div className="min-h-screen bg-white font-sans">
        <AuthLayout>
          <AuthForm mode={authMode} onToggleMode={toggleAuthMode} />
          <div className="mt-4 text-center">
            <TestEmailButton />
          </div>
        </AuthLayout>
      </div>
    </AppLayout>
  )
}

export default Auth
