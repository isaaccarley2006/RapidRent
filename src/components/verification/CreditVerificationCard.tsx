import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useVerificationStatus } from '@/hooks/useVerificationStatus'

export const CreditVerificationCard: React.FC = () => {
  const { verificationState, refresh } = useVerificationStatus()
  
  const getStatusIcon = () => {
    if (verificationState.credit_verified) return <CheckCircle className="w-5 h-5 text-green-600" />
    if (verificationState.comprehensive_verification_status === 'in_progress') return <Clock className="w-5 h-5 text-amber-500" />
    return <AlertCircle className="w-5 h-5 text-gray-400" />
  }

  const getStatusBadge = () => {
    if (verificationState.credit_verified) return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>
    if (verificationState.comprehensive_verification_status === 'in_progress') return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">In Progress</Badge>
    return <Badge variant="secondary">Not Started</Badge>
  }

  return (
    <Card className="h-full bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-text-primary">Credit Check</CardTitle>
              <p className="text-sm text-text-muted">Financial verification</p>
            </div>
          </div>
          {getStatusIcon()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">Status</span>
            {getStatusBadge()}
          </div>
        </div>

        <div className="pt-4">
          <Button 
            className="w-full bg-primary hover:bg-primary-dark text-white"
            disabled={verificationState.credit_verified}
          >
            {verificationState.credit_verified ? 'Verified' : 'Verify Credit'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}