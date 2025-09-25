import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, CheckCircle, FileText, Camera } from 'lucide-react'
import { useVerificationStatus } from '@/hooks/useVerificationStatus'

export const IdentityVerificationDetails: React.FC = () => {
  const { verificationState, refresh } = useVerificationStatus()

  const requirements = [
    {
      id: 'photo_id',
      label: 'Photo ID Upload',
      description: 'Passport, driving licence, or national ID card',
      completed: true
    },
    {
      id: 'proof_address',
      label: 'Proof of Address',
      description: 'Recent utility bill, bank statement, or council tax',
      completed: true
    },
    {
      id: 'identity_verification',
      label: 'Identity Verification',
      description: 'Live identity check completed with IDnow',
      completed: true
    }
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Identity Verification Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h4 className="font-medium text-green-900">Verification Complete</h4>
          </div>
          <p className="text-sm text-green-800">
            Your identity was successfully verified during signup. 
            All required documents and checks have been completed.
          </p>
        </div>

        <div className="space-y-4">
          {requirements.map((req) => (
            <div key={req.id} className="flex items-start gap-3 p-4 border rounded-lg bg-green-50/50">
              <div className="mt-1">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-text-primary">{req.label}</p>
                  <Badge variant="outline" className="text-green-600 bg-green-100">
                    Verified
                  </Badge>
                </div>
                <p className="text-sm text-text-muted">{req.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Verification includes:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Document authenticity check</li>
            <li>• Facial recognition matching</li>
            <li>• Address verification</li>
            <li>• Anti-fraud screening</li>
          </ul>
        </div>

        <Button 
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          disabled={true}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Identity Verified
        </Button>
      </CardContent>
    </Card>
  )
}