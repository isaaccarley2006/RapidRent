import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import { useDemoMode } from '@/hooks/useDemoMode'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle2, LogOut, Award, FileText } from 'lucide-react'
import { PersonalInformationTab } from '@/components/profile/PersonalInformationTab'
import { EmploymentInformationTab } from '@/components/profile/EmploymentInformationTab'
import { FinancialInformationTab } from '@/components/profile/FinancialInformationTab'
import { ReferencesTab } from '@/components/profile/ReferencesTab'
import { LandlordProfileContent } from '@/components/profile/LandlordProfileContent'
import IdentityVerificationCard from '@/components/verification/IdentityVerificationCard'
import { VerificationDashboard } from '@/components/verification/VerificationDashboard'
import { ReferenceCheckModal } from '@/components/referenceCheck/ReferenceCheckModal'

const Profile: React.FC = () => {
  const { user, signOut } = useAuth()
  const { isDemoMode } = useDemoMode()
  const [activeTab, setActiveTab] = useState('personal')
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
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-text-primary">Tenant Profile</h1>
          <p className="text-text-muted mt-2">
            Complete your verified tenant profile for faster applications
          </p>
        </div>

        {isDemoMode ? (
          <>
            <VerificationDashboard />
            
            {/* Reference Check CTA */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 mt-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Complete Reference Check</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Submit a comprehensive reference check to landlords. This includes identity verification, 
                        employment details, landlord references, and financial history.
                      </p>
                      <Button onClick={() => setShowReferenceModal(true)} className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Start Reference Check
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <div className="mt-4">
              <IdentityVerificationCard />
            </div>
          </>
        )}

        {/* Profile Form Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="references">References</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <PersonalInformationTab
              formData={formData}
              setFormData={setFormData}
              userEmail={user?.email || ''}
            />
          </TabsContent>

          <TabsContent value="employment">
            <EmploymentInformationTab
              formData={formData}
              setFormData={setFormData}
            />
          </TabsContent>

          <TabsContent value="financial">
            <FinancialInformationTab
              formData={formData}
              setFormData={setFormData}
            />
          </TabsContent>

          <TabsContent value="references">
            <ReferencesTab
              references={references}
              addReference={addReference}
            />
          </TabsContent>
        </Tabs>

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

export default Profile