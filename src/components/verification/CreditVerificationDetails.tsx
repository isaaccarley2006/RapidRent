import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { CreditCard, CheckCircle } from 'lucide-react'
import { useVerificationStatus } from '@/hooks/useVerificationStatus'

export const CreditVerificationDetails: React.FC = () => {
  const { verificationState, refresh } = useVerificationStatus()

  const requirements = [
    {
      id: 'consent',
      label: 'Consent to credit check',
      description: 'Allow Experian to access your credit history',
      completed: false
    },
    {
      id: 'financial_disclosure',
      label: 'Financial disclosure',
      description: 'Declare any CCJs, IVAs, or bankruptcy history',
      completed: false
    },
    {
      id: 'verification',
      label: 'Identity verification',
      description: 'Confirm your identity for the credit check',
      completed: verificationState.identity_verified
    }
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          Credit Check Requirements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {requirements.map((req) => (
            <div key={req.id} className="flex items-start gap-3 p-4 border rounded-lg">
              <div className="mt-1">
                {req.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Checkbox id={req.id} />
                )}
              </div>
              <div className="flex-1">
                <label htmlFor={req.id} className="font-medium text-text-primary cursor-pointer">
                  {req.label}
                </label>
                <p className="text-sm text-text-muted mt-1">{req.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Experian will perform a soft credit check</li>
            <li>• Your credit score will be verified</li>
            <li>• Results are typically available within minutes</li>
            <li>• This won't affect your credit score</li>
          </ul>
        </div>

        <Button 
          className="w-full bg-primary hover:bg-primary-dark text-white"
          disabled={verificationState.credit_verified}
          onClick={refresh}
        >
          {verificationState.credit_verified ? 'Verified' : 'Start Credit Check'}
        </Button>
      </CardContent>
    </Card>
  )
}