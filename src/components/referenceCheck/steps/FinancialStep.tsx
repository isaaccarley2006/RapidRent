import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CreditCard, AlertTriangle, Shield, Info } from 'lucide-react'
import { ReferenceCheckApplication } from '@/types/referenceCheck'

interface FinancialStepProps {
  data: ReferenceCheckApplication
  updateData: (updates: Partial<ReferenceCheckApplication>) => void
}

export const FinancialStep: React.FC<FinancialStepProps> = ({
  data,
  updateData
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Financial History</h2>
        <p className="text-muted-foreground">
          Provide consent for credit checks and disclose any relevant financial history.
        </p>
      </div>

      {/* Credit Check Consent */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="w-5 h-5 text-primary" />
            Credit Check Authorization
          </CardTitle>
          <CardDescription>
            We need your consent to perform a soft credit check which won't affect your credit score
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex-1">
              <Label htmlFor="credit_check_consent" className="text-base font-medium">
                I consent to a credit check
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Required for rental application processing
              </p>
            </div>
            <Switch
              id="credit_check_consent"
              checked={data.credit_check_consent}
              onCheckedChange={(checked) => updateData({ credit_check_consent: checked })}
            />
          </div>

          <Alert>
            <Shield className="w-4 h-4" />
            <AlertDescription>
              This will be a <strong>soft credit check</strong> which doesn't affect your credit score. 
              We use this to verify your identity and assess your creditworthiness for rental applications.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Financial Disclosures */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Financial Disclosures
          </CardTitle>
          <CardDescription>
            Please disclose any relevant financial history that may affect your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex-1">
              <Label htmlFor="has_ccj_iva_bankruptcy" className="text-base font-medium">
                Do you have any CCJs, IVAs, or bankruptcies?
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                County Court Judgements, Individual Voluntary Arrangements, or bankruptcy history
              </p>
            </div>
            <Switch
              id="has_ccj_iva_bankruptcy"
              checked={data.has_ccj_iva_bankruptcy}
              onCheckedChange={(checked) => updateData({ has_ccj_iva_bankruptcy: checked })}
            />
          </div>

          {data.has_ccj_iva_bankruptcy && (
            <div>
              <Label htmlFor="financial_explanation">Please provide details *</Label>
              <Textarea
                id="financial_explanation"
                placeholder="Please explain the circumstances, dates, and current status..."
                rows={4}
                value={data.financial_explanation || ''}
                onChange={(e) => updateData({ financial_explanation: e.target.value })}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Please provide full details including dates, amounts, and current status. 
                Honesty here helps us provide the best outcome for your application.
              </p>
            </div>
          )}

          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              Being honest about financial history helps landlords make informed decisions. 
              Many landlords will consider applications even with past financial difficulties 
              if they're disclosed upfront and explained clearly.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* What Happens Next */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-primary mt-1" />
            <div>
              <h3 className="font-medium text-foreground mb-2">Financial Verification Process</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Soft credit check performed (no impact on credit score)</li>
                <li>• Identity verification through credit agencies</li>
                <li>• Address history confirmation</li>
                <li>• Financial standing assessment</li>
                <li>• Results typically available within 24 hours</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}