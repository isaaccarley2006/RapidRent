import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import { useDemoMode } from '@/hooks/useDemoMode'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Award, FileText } from 'lucide-react'
import { LandlordProfileContent } from '@/components/profile/LandlordProfileContent'
import { ReferenceCheckModal } from '@/components/referenceCheck/ReferenceCheckModal'
import { CreditVerificationCard } from '@/components/verification/CreditVerificationCard'
import { IncomeVerificationCard } from '@/components/verification/IncomeVerificationCard'
import { RightToRentCard } from '@/components/verification/RightToRentCard'
import { IdentificationCard } from '@/components/verification/IdentificationCard'

const Profile: React.FC = () => {
  const { user, signOut } = useAuth()
  const { isDemoMode } = useDemoMode()
  const [showReferenceModal, setShowReferenceModal] = useState(false)
  
  const {
    profile,
    references,
    loading,
    saving,
    formData,
    setFormData,
    saveProfile,
    addReference
  } = useProfile()

  if (loading) {
    return <LoadingSpinner />
  }

  // Check if user is a landlord
  const isLandlord = formData.user_type === 'landlord'

  if (isLandlord) {
    return (
      <>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-text-primary">Landlord Profile</h1>
            <p className="text-text-muted mt-2">
              Complete your landlord profile to manage your properties
            </p>
          </div>

          <LandlordProfileContent
            formData={formData}
            setFormData={setFormData}
            userEmail={user?.email || ''}
          />

          {/* Save Button */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={signOut}
              className="text-red-600 hover:text-red-700"
            >
              Sign Out
            </Button>
            <Button onClick={saveProfile} disabled={saving} size="lg">
              {saving ? <LoadingSpinner /> : 'Save Profile'}
            </Button>
          </div>
        </div>

        <ReferenceCheckModal 
          open={showReferenceModal} 
          onOpenChange={setShowReferenceModal} 
        />
      </>
    )
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-text-primary">Verification Journey</h1>
          <p className="text-text-muted mt-2">
            Complete your verification to strengthen your rental applications
          </p>
        </div>

        {/* 4-Column Verification Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <CreditVerificationCard />
          <IncomeVerificationCard />
          <RightToRentCard />
          <IdentificationCard />
        </div>

        {/* Reference Check CTA */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">Complete Reference Check</h3>
                  <p className="text-sm text-text-muted mb-3">
                    Submit a comprehensive reference check to landlords. This includes identity verification, 
                    employment details, landlord references, and financial history.
                  </p>
                  <Button 
                    onClick={() => setShowReferenceModal(true)} 
                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white"
                  >
                    <FileText className="w-4 h-4" />
                    Start Reference Check
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sign Out Button */}
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={signOut}
            className="text-red-600 hover:text-red-700"
          >
            Sign Out
          </Button>
        </div>
      </div>

      <ReferenceCheckModal 
        open={showReferenceModal} 
        onOpenChange={setShowReferenceModal} 
      />
    </>
  )
}

export default Profile