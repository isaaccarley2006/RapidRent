
import React from 'react'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import { OnboardingForm } from '@/components/onboarding/OnboardingForm'
import { useAuthRedirect } from '@/hooks/useAuthRedirect'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

const Onboarding: React.FC = () => {
  const { loading } = useAuthRedirect()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <AuthLayout>
      <OnboardingForm />
    </AuthLayout>
  )
}

export default Onboarding
