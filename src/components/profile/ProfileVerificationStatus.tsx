import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Shield, Check, Clock } from 'lucide-react'
import { useVerificationStatus } from '@/hooks/useVerificationStatus'

interface ProfileVerificationStatusProps {
  profile?: any // Keep for compatibility but we'll use the hook instead
}

export const ProfileVerificationStatus: React.FC<ProfileVerificationStatusProps> = ({ profile }) => {
  const { verificationState, getVerificationProgress, loading } = useVerificationStatus();

  const getVerificationColor = (verified: boolean) => {
    return verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
  }

  const getVerificationIcon = (verified: boolean) => {
    return verified ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />
  }

  if (loading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Profile Verification Status
          </CardTitle>
          <CardDescription>Loading verification status...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Profile Verification Status
        </CardTitle>
        <CardDescription>
          Complete and verify your profile to speed up rental applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm text-text-muted">
                {getVerificationProgress()}%
              </span>
            </div>
            <Progress value={getVerificationProgress()} className="h-2" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'identity', label: 'Identity', verified: verificationState.identity_verified },
              { key: 'employment', label: 'Employment', verified: verificationState.employment_verified },
              { key: 'income', label: 'Income', verified: verificationState.income_verified },
              { key: 'credit', label: 'Credit Score', verified: verificationState.credit_verified },
              { key: 'references', label: 'References', verified: verificationState.references_verified },
              { key: 'bank', label: 'Bank Details', verified: verificationState.bank_verified }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">{item.label}</span>
                <Badge className={getVerificationColor(item.verified || false)}>
                  {getVerificationIcon(item.verified || false)}
                  {item.verified ? 'Verified' : 'Pending'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}