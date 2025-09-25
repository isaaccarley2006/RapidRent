import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Building } from 'lucide-react'
import { TenantProfile } from '@/types/profile'

interface EmploymentCardProps {
  formData: Partial<TenantProfile>
  setFormData: (data: Partial<TenantProfile>) => void
}

export const EmploymentCard: React.FC<EmploymentCardProps> = ({
  formData,
  setFormData
}) => {
  const completedFields = [
    formData.employment_status,
    formData.annual_income,
    formData.employer_name,
    formData.job_title
  ].filter(Boolean).length

  const totalFields = 4
  const completionPercentage = Math.round((completedFields / totalFields) * 100)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building className="w-4 h-4 text-primary" />
            </div>
            Employment Information
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-sm text-muted-foreground">{completionPercentage}% complete</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
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
        </div>
      </CardContent>
    </Card>
  )
}