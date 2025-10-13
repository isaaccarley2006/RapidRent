import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, CheckCircle, MapPin, AlertCircle, FileText } from 'lucide-react'
import { useVerificationStatus } from '@/hooks/useVerificationStatus'
import { DocumentUploadSection } from './DocumentUploadSection'
import { VisaInfoCollector } from './VisaInfoCollector'
import { getVisaRequirements, isPassportAlreadyProvided } from '@/utils/visaRequirements'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from '@/hooks/use-toast'

export const RightToRentDetails: React.FC = () => {
  const { user } = useAuth()
  const { verificationState, refresh } = useVerificationStatus()
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, string>>({})

  const handleVisaInfoSave = () => {
    refresh() // Refresh verification state after saving visa info
  }

  // If user doesn't have nationality or visa_type, show collector
  if (!verificationState.nationality || !verificationState.visa_type) {
    return (
      <VisaInfoCollector 
        userId={user?.id || ''} 
        onSave={handleVisaInfoSave} 
      />
    )
  }

  const visaRequirements = getVisaRequirements(verificationState.visa_type)
  const passportAlreadyProvided = isPassportAlreadyProvided(verificationState.identity_verified)

  const handleDocumentUpload = async (documentId: string, file: File) => {
    try {
      // Simulate upload - in real implementation, upload to Supabase storage
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setUploadedDocuments(prev => ({
        ...prev,
        [documentId]: file.name
      }))
      
      toast({
        title: "Document uploaded successfully",
        description: `${file.name} has been uploaded and will be reviewed.`,
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive"
      })
    }
  }

  const handleDocumentRemove = (documentId: string) => {
    setUploadedDocuments(prev => {
      const updated = { ...prev }
      delete updated[documentId]
      return updated
    })
    
    toast({
      title: "Document removed",
      description: "The document has been removed from your application.",
    })
  }

  const getCompletionProgress = () => {
    const totalRequired = visaRequirements.requiredDocuments.filter(doc => 
      doc.required && !(doc.id === 'passport' && passportAlreadyProvided)
    ).length
    
    const completed = visaRequirements.requiredDocuments.filter(doc => {
      if (doc.id === 'passport' && passportAlreadyProvided) return true
      return uploadedDocuments[doc.id] || !doc.required
    }).length
    
    return { completed, total: visaRequirements.requiredDocuments.length }
  }

  const isFullyComplete = () => {
    return visaRequirements.requiredDocuments.every(doc => {
      if (doc.id === 'passport' && passportAlreadyProvided) return true
      return uploadedDocuments[doc.id] || !doc.required
    })
  }

  const progress = getCompletionProgress()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Right to Rent Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-blue-900">Your Visa Information</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700 font-medium">Nationality:</span>
              <p className="text-blue-800">{verificationState.nationality || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Visa Type:</span>
              <p className="text-blue-800">{verificationState.visa_type || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Document Collection Progress</h4>
            <Badge variant={isFullyComplete() ? "default" : "secondary"}>
              {progress.completed} of {progress.total} completed
            </Badge>
          </div>
          <div className="w-full bg-background rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(progress.completed / progress.total) * 100}%` }}
            />
          </div>
        </div>

        {/* Eligibility Status */}
        {visaRequirements.eligibility === 'not_eligible' ? (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h4 className="font-medium text-red-900">Visa Type Not Recognized</h4>
            </div>
            <p className="text-sm text-red-800">
              Your visa type "{verificationState.visa_type}" is not in our system. 
              Please contact support for assistance with your Right to Rent verification.
            </p>
          </div>
        ) : (
          <>
            {visaRequirements.eligibility === 'eligible_limited' && (
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <h4 className="font-medium text-orange-900">Limited Rental Eligibility</h4>
                </div>
                <p className="text-sm text-orange-800">
                  Your visa type has some limitations on rental agreements. 
                  Additional documentation may be required.
                </p>
              </div>
            )}

            {/* Document Requirements */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Required Documents</h4>
              {visaRequirements.requiredDocuments.map((doc) => {
                const isSkipped = doc.id === 'passport' && passportAlreadyProvided
                const isUploaded = Boolean(uploadedDocuments[doc.id])
                
                return (
                  <DocumentUploadSection
                    key={doc.id}
                    document={doc}
                    isUploaded={isUploaded}
                    isSkipped={isSkipped}
                    uploadedFileName={uploadedDocuments[doc.id]}
                    onUpload={(file) => handleDocumentUpload(doc.id, file)}
                    onRemove={() => handleDocumentRemove(doc.id)}
                  />
                )
              })}
            </div>

            {/* What this covers */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">What this verification covers:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Confirms your legal right to rent in the UK</li>
                <li>• Validates your immigration status and visa conditions</li>
                <li>• Provides landlords with compliance assurance</li>
                <li>• Meets Home Office Right to Rent requirements</li>
              </ul>
            </div>

            {/* Action Button */}
            <Button 
              className="w-full"
              variant={isFullyComplete() ? "default" : "secondary"}
              disabled={!isFullyComplete()}
              onClick={refresh}
            >
              {isFullyComplete() ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit for Verification
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Upload Required Documents ({progress.total - progress.completed} remaining)
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}