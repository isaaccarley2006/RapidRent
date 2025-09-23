import React from 'react'
import { FileUpload } from '@/components/auth/FileUpload'
import { TrustMarkers } from '@/components/auth/TrustMarkers'

interface VerificationStepProps {
  onFilesChange: (files: File[]) => void
}

export const VerificationStep: React.FC<VerificationStepProps> = ({ onFilesChange }) => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-text-primary">
            Verify your ID (Optional)
          </h3>
          <p className="text-sm text-text-muted">
            Upload your passport, driving licence, or biometric residence permit. This helps speed up your rental applications. Compliant with UK Right-to-Rent and AML guidance.
          </p>
        </div>
        
        <FileUpload onFilesChange={onFilesChange} />
      </div>

      <TrustMarkers />
    </div>
  )
}