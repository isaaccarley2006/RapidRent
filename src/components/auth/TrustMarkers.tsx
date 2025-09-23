import React from 'react'
import { Shield, CheckCircle, CreditCard } from 'lucide-react'

export const TrustMarkers: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-6 py-4 border-t border-muted">
      <div className="flex items-center space-x-2">
        <Shield className="w-4 h-4 text-accent" />
        <span className="text-xs text-text-muted font-medium">Secure verification</span>
      </div>
      <div className="flex items-center space-x-2">
        <CheckCircle className="w-4 h-4 text-accent" />
        <span className="text-xs text-text-muted font-medium">GDPR compliant</span>
      </div>
      <div className="flex items-center space-x-2">
        <CreditCard className="w-4 h-4 text-accent" />
        <span className="text-xs text-text-muted font-medium">No hidden fees</span>
      </div>
    </div>
  )
}