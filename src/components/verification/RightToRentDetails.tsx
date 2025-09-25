import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, CheckCircle, MapPin, FileText } from 'lucide-react'
import { useVerificationStatus } from '@/hooks/useVerificationStatus'

export const RightToRentDetails: React.FC = () => {
  const { verificationState, refresh } = useVerificationStatus()

  // Mock data - in real implementation, this would come from the profile
  const existingVisaData = {
    nationality: 'United Kingdom',
    visaType: 'British Citizen',
    hasRightToRent: true
  }

  const requirements = [
    {
      id: 'nationality',
      label: 'Nationality Information',
      description: 'Your nationality and immigration status',
      completed: true,
      value: existingVisaData.nationality
    },
    {
      id: 'visa_status',
      label: 'Visa/Immigration Status',
      description: 'Your current visa type or citizenship status',
      completed: true,
      value: existingVisaData.visaType
    },
    {
      id: 'documentation',
      label: 'Supporting Documentation',
      description: 'Passport, visa, or right to rent documents',
      completed: existingVisaData.hasRightToRent
    }
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Right to Rent Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h4 className="font-medium text-green-900">Information Already Provided</h4>
          </div>
          <p className="text-sm text-green-800">
            You provided your nationality and visa information during signup. 
            We've pre-filled the details below.
          </p>
        </div>

        <div className="space-y-4">
          {requirements.map((req) => (
            <div key={req.id} className="flex items-start gap-3 p-4 border rounded-lg">
              <div className="mt-1">
                {req.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <FileText className="w-5 h-5 text-text-muted" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-text-primary">{req.label}</p>
                  {req.completed && <Badge variant="outline" className="text-green-600">Completed</Badge>}
                </div>
                <p className="text-sm text-text-muted mb-2">{req.description}</p>
                {req.value && (
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="w-4 h-4 text-text-muted" />
                    <span className="text-sm font-medium">{req.value}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">What this covers:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Confirms your legal right to rent in the UK</li>
            <li>• Validates your immigration status</li>
            <li>• Provides landlords with compliance assurance</li>
            <li>• Meets Home Office requirements</li>
          </ul>
        </div>

        <Button 
          className="w-full bg-primary hover:bg-primary-dark text-white"
          disabled={true}
          onClick={refresh}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Right to Rent Verified
        </Button>
      </CardContent>
    </Card>
  )
}