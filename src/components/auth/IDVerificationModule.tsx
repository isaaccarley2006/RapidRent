import React from 'react'
import { FileUpload } from '@/components/auth/FileUpload'

interface IDVerificationModuleProps {
  onFilesChange: (files: File[]) => void
}

export const IDVerificationModule: React.FC<IDVerificationModuleProps> = ({ onFilesChange }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-text-primary">
          Verify your ID
        </h3>
        <p className="text-sm text-text-muted">
          Upload your passport, driving licence, or biometric residence permit. Compliant with UK Right-to-Rent and AML guidance.
        </p>
      </div>
      
      <FileUpload onFilesChange={onFilesChange} />
    </div>
  )
}