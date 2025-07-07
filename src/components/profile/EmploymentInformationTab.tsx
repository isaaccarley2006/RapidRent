import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Building } from 'lucide-react'
import { TenantProfile } from '@/types/profile'

interface EmploymentInformationTabProps {
  formData: Partial<TenantProfile>
  setFormData: (data: Partial<TenantProfile>) => void
}

export const EmploymentInformationTab: React.FC<EmploymentInformationTabProps> = ({
  formData,
  setFormData
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5 text-primary" />
          Employment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="employment_status">Employment Status *</Label>
            <Select 
              value={formData.employment_status || ''} 
              onValueChange={(value) => setFormData({...formData, employment_status: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employed">Employed Full-time</SelectItem>
                <SelectItem value="part-time">Employed Part-time</SelectItem>
                <SelectItem value="self-employed">Self-employed</SelectItem>
                <SelectItem value="contract">Contract Worker</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
                <SelectItem value="unemployed">Unemployed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="annual_income">Annual Income (£) *</Label>
            <Input
              id="annual_income"
              type="number"
              value={formData.annual_income || ''}
              onChange={(e) => setFormData({...formData, annual_income: parseFloat(e.target.value) || 0})}
              placeholder="e.g. 35000"
            />
          </div>
          <div>
            <Label htmlFor="employer_name">Employer Name</Label>
            <Input
              id="employer_name"
              value={formData.employer_name || ''}
              onChange={(e) => setFormData({...formData, employer_name: e.target.value})}
              placeholder="Company name"
            />
          </div>
          <div>
            <Label htmlFor="job_title">Job Title</Label>
            <Input
              id="job_title"
              value={formData.job_title || ''}
              onChange={(e) => setFormData({...formData, job_title: e.target.value})}
              placeholder="Your job title"
            />
          </div>
          <div>
            <Label htmlFor="employment_start_date">Employment Start Date</Label>
            <Input
              id="employment_start_date"
              type="date"
              value={formData.employment_start_date || ''}
              onChange={(e) => setFormData({...formData, employment_start_date: e.target.value})}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="employer_address">Employer Address</Label>
          <Textarea
            id="employer_address"
            value={formData.employer_address || ''}
            onChange={(e) => setFormData({...formData, employer_address: e.target.value})}
            placeholder="Enter employer's full address"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  )
}