import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ProfileVerificationStatus } from '@/components/profile/ProfileVerificationStatus'
import { PersonalInformationTab } from '@/components/profile/PersonalInformationTab'
import { EmploymentInformationTab } from '@/components/profile/EmploymentInformationTab'
import { FinancialInformationTab } from '@/components/profile/FinancialInformationTab'
import { ReferencesTab } from '@/components/profile/ReferencesTab'
import { useProfile } from '@/hooks/useProfile'

const Profile: React.FC = () => {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('personal')
  
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-text-primary">Tenant Profile</h1>
        <p className="text-text-muted mt-2">
          Complete your verified tenant profile for faster applications
        </p>
      </div>

      <ProfileVerificationStatus profile={profile} />

      {/* Profile Form Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
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
  )
}

export default Profile