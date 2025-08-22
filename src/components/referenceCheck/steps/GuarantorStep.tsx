import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, Upload, User, Briefcase, DollarSign } from 'lucide-react'
import { ReferenceCheckApplication } from '@/types/referenceCheck'
import { DocumentUpload } from '../DocumentUpload'

interface GuarantorStepProps {
  data: ReferenceCheckApplication
  updateData: (updates: Partial<ReferenceCheckApplication>) => void
}

export const GuarantorStep: React.FC<GuarantorStepProps> = ({
  data,
  updateData
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Guarantor Information</h2>
        <p className="text-muted-foreground">
          A guarantor may be required depending on your income or credit history. Please provide details if you have one.
        </p>
      </div>

      {/* Guarantor Required Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5 text-primary" />
            Guarantor Required
          </CardTitle>
          <CardDescription>
            Will you be providing a guarantor for this application?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex-1">
              <Label htmlFor="has_guarantor" className="text-base font-medium">
                I will provide a guarantor
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                A guarantor is someone who agrees to pay rent if you cannot
              </p>
            </div>
            <Switch
              id="has_guarantor"
              checked={data.has_guarantor}
              onCheckedChange={(checked) => updateData({ has_guarantor: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {data.has_guarantor && (
        <>
          {/* Guarantor Personal Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-primary" />
                Guarantor Personal Details
              </CardTitle>
              <CardDescription>
                Basic information about your guarantor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="guarantor_name">Guarantor Full Name *</Label>
                <Input
                  id="guarantor_name"
                  placeholder="John Smith"
                  value={data.guarantor_name || ''}
                  onChange={(e) => updateData({ guarantor_name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="guarantor_relationship">Relationship to You *</Label>
                <Select 
                  value={data.guarantor_relationship || ''} 
                  onValueChange={(value) => updateData({ guarantor_relationship: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="family_member">Family Member</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="guarantor_address">Guarantor Address *</Label>
                <Textarea
                  id="guarantor_address"
                  placeholder="Full address including postcode"
                  rows={3}
                  value={data.guarantor_address || ''}
                  onChange={(e) => updateData({ guarantor_address: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Guarantor Employment & Income */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="w-5 h-5 text-primary" />
                Guarantor Employment & Income
              </CardTitle>
              <CardDescription>
                Employment details and income information for your guarantor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guarantor_employer_name">Employer Name *</Label>
                  <Input
                    id="guarantor_employer_name"
                    placeholder="Company Ltd"
                    value={data.guarantor_employer_name || ''}
                    onChange={(e) => updateData({ guarantor_employer_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="guarantor_job_title">Job Title *</Label>
                  <Input
                    id="guarantor_job_title"
                    placeholder="Manager"
                    value={data.guarantor_job_title || ''}
                    onChange={(e) => updateData({ guarantor_job_title: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="guarantor_annual_income">Annual Income *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="guarantor_annual_income"
                    type="number"
                    placeholder="45000"
                    className="pl-10"
                    value={data.guarantor_annual_income || ''}
                    onChange={(e) => updateData({ guarantor_annual_income: Number(e.target.value) })}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Guarantors typically need to earn at least 2.5x the annual rent
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Guarantor Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="w-5 h-5 text-primary" />
                Guarantor Documents
              </CardTitle>
              <CardDescription>
                Upload identification and proof of address for your guarantor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DocumentUpload
                label="Guarantor Photo ID"
                description="Passport or driving licence"
                accept="image/*,.pdf"
                icon={<Upload className="w-4 h-4" />}
                onUpload={(url) => updateData({ guarantor_id_url: url })}
                currentUrl={data.guarantor_id_url}
                required
              />

              <DocumentUpload
                label="Guarantor Proof of Address"
                description="Recent utility bill or bank statement"
                accept="image/*,.pdf"
                icon={<Upload className="w-4 h-4" />}
                onUpload={(url) => updateData({ guarantor_proof_address_url: url })}
                currentUrl={data.guarantor_proof_address_url}
                required
              />
            </CardContent>
          </Card>
        </>
      )}

      {!data.has_guarantor && (
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-primary mt-1" />
              <div>
                <h3 className="font-medium text-foreground mb-2">No Guarantor Required</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Based on your income and credit profile, you may not need a guarantor. 
                  However, some landlords may still request one. You can always add guarantor 
                  details later if required.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}