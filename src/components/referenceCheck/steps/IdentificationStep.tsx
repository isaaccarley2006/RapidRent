import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Shield, Upload, FileText, IdCard } from 'lucide-react'
import { ReferenceCheckApplication } from '@/types/referenceCheck'
import { DocumentUpload } from '../DocumentUpload'

interface IdentificationStepProps {
  data: ReferenceCheckApplication
  updateData: (updates: Partial<ReferenceCheckApplication>) => void
}

export const IdentificationStep: React.FC<IdentificationStepProps> = ({
  data,
  updateData
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Identification Documents</h2>
        <p className="text-muted-foreground">
          Please upload valid identification documents and provide your immigration status.
        </p>
      </div>

      {/* Immigration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5 text-primary" />
            Right to Rent Status
          </CardTitle>
          <CardDescription>
            Please select your immigration status and upload relevant documents if applicable
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="immigration_status">Immigration Status *</Label>
            <Select 
              value={data.immigration_status || ''} 
              onValueChange={(value) => updateData({ immigration_status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uk_citizen">UK Citizen</SelectItem>
                <SelectItem value="eu_settled">EU Settled Status</SelectItem>
                <SelectItem value="eu_pre_settled">EU Pre-Settled Status</SelectItem>
                <SelectItem value="tier2_visa">Tier 2 Work Visa</SelectItem>
                <SelectItem value="student_visa">Student Visa</SelectItem>
                <SelectItem value="other_visa">Other Visa/Permit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {data.immigration_status && !['uk_citizen'].includes(data.immigration_status) && (
            <DocumentUpload
              label="Right to Rent Document"
              description="Upload your visa, permit, or settlement document"
              accept="image/*,.pdf"
              icon={<FileText className="w-4 h-4" />}
              onUpload={(url) => updateData({ right_to_rent_document_url: url })}
              currentUrl={data.right_to_rent_document_url}
            />
          )}
        </CardContent>
      </Card>

      {/* Photo ID */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <IdCard className="w-5 h-5 text-primary" />
            Photo Identification
          </CardTitle>
          <CardDescription>
            Upload a clear photo of your government-issued photo ID
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentUpload
            label="Photo ID (Passport/Driving Licence)"
            description="Must be current and clearly legible"
            accept="image/*,.pdf"
            icon={<Upload className="w-4 h-4" />}
            onUpload={(url) => updateData({ photo_id_url: url })}
            currentUrl={data.photo_id_url}
            required
          />
        </CardContent>
      </Card>

      {/* Proof of Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-primary" />
            Proof of Address
          </CardTitle>
          <CardDescription>
            Upload a recent utility bill, bank statement, or council tax bill (within last 3 months)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentUpload
            label="Proof of Address"
            description="Utility bill, bank statement, or council tax bill"
            accept="image/*,.pdf"
            icon={<Upload className="w-4 h-4" />}
            onUpload={(url) => updateData({ proof_of_address_url: url })}
            currentUrl={data.proof_of_address_url}
            required
          />
        </CardContent>
      </Card>
    </div>
  )
}