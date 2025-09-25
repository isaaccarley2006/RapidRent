import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import { useDemoMode } from '@/hooks/useDemoMode'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'
import { LandlordProfileContent } from '@/components/profile/LandlordProfileContent'
import { CreditVerificationCard } from '@/components/verification/CreditVerificationCard'
import { IncomeVerificationCard } from '@/components/verification/IncomeVerificationCard'
import { RightToRentCard } from '@/components/verification/RightToRentCard'
import { IdentificationCard } from '@/components/verification/IdentificationCard'
import { CreditVerificationDetails } from '@/components/verification/CreditVerificationDetails'
import { IncomeVerificationDetails } from '@/components/verification/IncomeVerificationDetails'
import { RightToRentDetails } from '@/components/verification/RightToRentDetails'
import { IdentityVerificationDetails } from '@/components/verification/IdentityVerificationDetails'

type VerificationSection = 'credit' | 'income' | 'rightToRent' | 'identity' | null

const Profile: React.FC = () => {
  const { user, signOut } = useAuth()
  const { isDemoMode } = useDemoMode()
  const [expandedSection, setExpandedSection] = useState<VerificationSection>(null)
  
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
      </>
    )
  }

  const handleCardClick = (section: VerificationSection) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const renderDetailSection = () => {
    switch (expandedSection) {
      case 'credit':
        return <CreditVerificationDetails />
      case 'income':
        return <IncomeVerificationDetails />
      case 'rightToRent':
        return <RightToRentDetails />
      case 'identity':
        return <IdentityVerificationDetails />
      default:
        return null
    }
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
          <div 
            className={`cursor-pointer transition-all duration-200 ${
              expandedSection === 'credit' ? 'ring-2 ring-primary' : 'hover:shadow-lg'
            }`}
            onClick={() => handleCardClick('credit')}
          >
            <CreditVerificationCard />
          </div>
          <div 
            className={`cursor-pointer transition-all duration-200 ${
              expandedSection === 'income' ? 'ring-2 ring-primary' : 'hover:shadow-lg'
            }`}
            onClick={() => handleCardClick('income')}
          >
            <IncomeVerificationCard />
          </div>
          <div 
            className={`cursor-pointer transition-all duration-200 ${
              expandedSection === 'rightToRent' ? 'ring-2 ring-primary' : 'hover:shadow-lg'
            }`}
            onClick={() => handleCardClick('rightToRent')}
          >
            <RightToRentCard />
          </div>
          <div 
            className={`cursor-pointer transition-all duration-200 ${
              expandedSection === 'identity' ? 'ring-2 ring-primary' : 'hover:shadow-lg'
            }`}
            onClick={() => handleCardClick('identity')}
          >
            <IdentificationCard />
          </div>
        </div>

        {/* Expandable Details Section */}
        <Collapsible open={expandedSection !== null} onOpenChange={() => setExpandedSection(null)}>
          <CollapsibleContent className="space-y-0">
            {expandedSection && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-text-primary capitalize">
                    {expandedSection === 'rightToRent' ? 'Right to Rent' : expandedSection} Details
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedSection(null)}
                    className="text-text-muted hover:text-text-primary"
                  >
                    <ChevronDown className="w-4 h-4 rotate-180" />
                    Collapse
                  </Button>
                </div>
                {renderDetailSection()}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

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
    </>
  )
}

export default Profile