import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Award, Shield, FileText, CheckCircle2, Signature } from 'lucide-react'
import { ReferenceCheckApplication } from '@/types/referenceCheck'

interface ConsentStepProps {
  data: ReferenceCheckApplication
  updateData: (updates: Partial<ReferenceCheckApplication>) => void
}

export const ConsentStep: React.FC<ConsentStepProps> = ({
  data,
  updateData
}) => {
  const [signatureName, setSignatureName] = useState('')

  const handleDigitalSignature = () => {
    const timestamp = new Date().toISOString()
    const signature = `${signatureName} - ${timestamp}`
    updateData({ 
      digital_signature: signature,
      declaration_date: new Date().toISOString().split('T')[0]
    })
  }

  const isFormComplete = data.information_consent && data.contact_consent && data.digital_signature

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Consent & Declaration</h2>
        <p className="text-muted-foreground">
          Please review and provide your consent for the reference check process.
        </p>
      </div>

      {/* Application Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-primary" />
            Application Summary
          </CardTitle>
          <CardDescription>
            Review what you've provided for your reference check
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Identity Documents</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Employment Details</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Landlord Reference</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Financial History</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consent Checkboxes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5 text-primary" />
            Required Consents
          </CardTitle>
          <CardDescription>
            Please provide your consent for the reference check process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex-1 pr-4">
              <Label htmlFor="information_consent" className="text-base font-medium">
                I confirm that the information provided is true and complete
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                I understand that providing false information may result in rejection of my application
              </p>
            </div>
            <Switch
              id="information_consent"
              checked={data.information_consent}
              onCheckedChange={(checked) => updateData({ information_consent: checked })}
            />
          </div>

          <div className="flex items-start justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex-1 pr-4">
              <Label htmlFor="contact_consent" className="text-base font-medium">
                I authorise contact with my employer, landlord, and credit agencies
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                This allows us to verify the information you've provided for your reference check
              </p>
            </div>
            <Switch
              id="contact_consent"
              checked={data.contact_consent}
              onCheckedChange={(checked) => updateData({ contact_consent: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Digital Signature */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Signature className="w-5 h-5 text-primary" />
            Digital Signature
          </CardTitle>
          <CardDescription>
            Type your full name to digitally sign this application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="signature_name">Full Name (as digital signature)</Label>
              <Input
                id="signature_name"
                placeholder="Type your full legal name"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleDigitalSignature}
                disabled={!signatureName.trim()}
                className="flex items-center gap-2"
              >
                <Signature className="w-4 h-4" />
                Sign
              </Button>
            </div>
          </div>

          {data.digital_signature && (
            <Alert>
              <CheckCircle2 className="w-4 h-4" />
              <AlertDescription>
                <strong>Digitally signed:</strong> {data.digital_signature}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Final Confirmation */}
      {isFormComplete && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Ready to Submit</h3>
                <p className="text-sm text-green-700 mt-1">
                  Your reference check application is complete and ready for submission. 
                  Click "Submit Application" to send it for processing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legal Notice */}
      <Alert>
        <Shield className="w-4 h-4" />
        <AlertDescription>
          <strong>Data Protection Notice:</strong> Your personal information will be processed 
          in accordance with GDPR and will only be used for rental reference purposes. 
          All data is encrypted and stored securely.
        </AlertDescription>
      </Alert>
    </div>
  )
}