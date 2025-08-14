import React from 'react'
import { AlertCircle, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ProfileGateProps {
  isComplete: boolean
  completionPercentage: number
  onCompleteProfile: () => void
}

export const ProfileGate: React.FC<ProfileGateProps> = ({
  isComplete,
  completionPercentage,
  onCompleteProfile
}) => {
  if (isComplete) return null

  return (
    <Card className="border-orange-200 bg-orange-50 mb-6">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-orange-800 mb-2">
              Complete Your Profile to Submit Offers
            </h3>
            <p className="text-orange-700 mb-4">
              Your profile is {completionPercentage}% complete. Complete your verified profile to submit offers to landlords.
            </p>
            <Button 
              onClick={onCompleteProfile}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <User className="w-4 h-4 mr-2" />
              Complete Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}