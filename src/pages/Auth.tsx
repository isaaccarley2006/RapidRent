
import React, { useState } from 'react'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import { AuthForm } from '@/components/auth/AuthForm'
import { useAuthRedirect } from '@/hooks/useAuthRedirect'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

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
    <div className="min-h-screen bg-white font-sans">
      <AuthLayout>
        <AuthForm mode={authMode} onToggleMode={toggleAuthMode} />
      </AuthLayout>
    </div>
  )
}

export default Auth
