import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ProfileWizard } from '@/components/renter/ProfileWizard'
import { useRenterProfile } from '@/hooks/useRenterProfile'
import { RenterProfileWizardFormData } from '@/schemas/renter'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

const RenterProfile: React.FC = () => {
  const navigate = useNavigate()
  const { saving, saveWizardData } = useRenterProfile()

  const handleSubmit = async (data: RenterProfileWizardFormData) => {
    const success = await saveWizardData(data)
    if (success) {
      navigate('/dashboard')
    }
    return success
  }

  const handleCancel = () => {
    navigate('/dashboard')
  }

  return (
    <>
      <Helmet>
        <title>Complete Your Renter Profile - RapidRent</title>
        <meta name="description" content="Complete your renter profile to submit verified offers to landlords." />
      </Helmet>
      
      <div className="min-h-screen bg-background font-sans">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-4">
              Complete Your Renter Profile
            </h1>
            <p className="text-text-muted max-w-2xl mx-auto">
              Complete your profile to submit verified offers to landlords. This helps you stand out and makes the application process faster.
            </p>
          </div>

          <ProfileWizard
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            saving={saving}
          />
        </div>
      </div>
    </>
  )
}

export default RenterProfile