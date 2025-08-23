import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Briefcase, Mail, Phone, Upload, Banknote } from 'lucide-react'
import { ReferenceCheckApplication } from '@/types/referenceCheck'
import { DocumentUpload } from '../DocumentUpload'

interface EmploymentStepProps {
  data: ReferenceCheckApplication
  updateData: (updates: Partial<ReferenceCheckApplication>) => void
}

export const EmploymentStep: React.FC<EmploymentStepProps> = ({
  data,
  updateData
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Employment & Income</h2>
        <p className="text-muted-foreground">
          Provide your current employment details and employer contact information.
        </p>
      </div>

      {/* Employer Contact Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="w-5 h-5 text-primary" />
            Employer Contact Information
          </CardTitle>
          <CardDescription>
            We'll contact your employer or HR department for verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employer_contact_email">HR/Manager Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="employer_contact_email"
                  type="email"
                  placeholder="hr@company.com"
                  className="pl-10"
                  value={data.employer_contact_email || ''}
                  onChange={(e) => updateData({ employer_contact_email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="employer_contact_phone">HR/Manager Phone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="employer_contact_phone"
                  type="tel"
                  placeholder="020 1234 5678"
                  className="pl-10"
                  value={data.employer_contact_phone || ''}
                  onChange={(e) => updateData({ employer_contact_phone: e.target.value })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employment Type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Banknote className="w-5 h-5 text-primary" />
            Employment Details
          </CardTitle>
          <CardDescription>
            Specify your employment type and contract details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="employment_type">Employment Type *</Label>
            <Select 
              value={data.employment_type || ''} 
              onValueChange={(value: any) => updateData({ employment_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="permanent">Permanent Contract</SelectItem>
                <SelectItem value="fixed-term">Fixed-Term Contract</SelectItem>
                <SelectItem value="probation">Probationary Period</SelectItem>
                <SelectItem value="self-employed">Self-Employed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Proof of Income */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Upload className="w-5 h-5 text-primary" />
            Proof of Income
          </CardTitle>
          <CardDescription>
            {data.employment_type === 'self-employed' 
              ? 'Upload your SA302 form or accountant letter'
              : 'Upload your last 3 payslips and P60 (if available)'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.employment_type === 'self-employed' ? (
            <DocumentUpload
              label="SA302 Form or Accountant Letter"
              description="Most recent tax return or accountant verification"
              accept="image/*,.pdf"
              icon={<Upload className="w-4 h-4" />}
              onUpload={(url) => updateData({ 
                proof_of_income_urls: [url] 
              })}
              currentUrl={data.proof_of_income_urls?.[0]}
              required
            />
          ) : (
            <>
              <DocumentUpload
                label="Recent Payslips (Last 3 months)"
                description="Upload your 3 most recent payslips"
                accept="image/*,.pdf"
                icon={<Upload className="w-4 h-4" />}
                onUpload={(url) => updateData({ 
                  proof_of_income_urls: [...(data.proof_of_income_urls || []), url] 
                })}
                currentUrl={data.proof_of_income_urls?.[0]}
                required
                multiple
              />
              <DocumentUpload
                label="P60 (Optional)"
                description="Upload your most recent P60 if available"
                accept="image/*,.pdf"
                icon={<Upload className="w-4 h-4" />}
                onUpload={(url) => updateData({ 
                  proof_of_income_urls: [...(data.proof_of_income_urls || []), url] 
                })}
                currentUrl={data.proof_of_income_urls?.[1]}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}