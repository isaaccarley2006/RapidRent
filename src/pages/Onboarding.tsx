
import React from 'react'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import { OnboardingForm } from '@/components/onboarding/OnboardingForm'
import { useAuthRedirect } from '@/hooks/useAuthRedirect'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { AppLayout } from '@/components/layouts/AppLayout'

const Onboarding: React.FC = () => {
  const { loading } = useAuthRedirect()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <AppLayout showNavigation={false}>
      <div className="min-h-screen bg-white font-sans">
        <AuthLayout>
          <OnboardingForm />
        </AuthLayout>
      </div>
    </AppLayout>
  )
}

export default Onboarding
