
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { useAuth } from '@/contexts/AuthContext'
import { CheckCircle } from 'lucide-react'

const EmailConfirmed: React.FC = () => {
  const navigate = useNavigate()
  const { user, session, loading } = useAuth()
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleContinueToDashboard = () => {
    setIsRedirecting(true)
    navigate('/dashboard')
  }

  // If user is not authenticated after loading completes, redirect to auth
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth')
    }
  }, [loading, user, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user || !session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-primary mb-2">
            Thank you for confirming your email!
          </h1>
          <p className="text-text-muted text-base mt-2">
            Welcome to RentView – you're all set to get started.
          </p>
        </div>
        
        <Button
          onClick={handleContinueToDashboard}
          disabled={isRedirecting}
          className="bg-primary text-white rounded-xl font-medium px-6 py-2 hover:bg-primary-dark transition-colors w-full"
        >
          {isRedirecting ? 'Redirecting...' : 'Continue to Dashboard'}
        </Button>
      </div>
    </div>
  )
}

export default EmailConfirmed
