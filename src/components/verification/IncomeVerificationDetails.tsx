import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TrendingUp, Upload, CheckCircle } from 'lucide-react'
import { useVerificationStatus } from '@/hooks/useVerificationStatus'

export const IncomeVerificationDetails: React.FC = () => {
  const { verificationState, refresh } = useVerificationStatus()

  const requirements = [
    {
      id: 'employment_details',
      label: 'Employment Information',
      description: 'Employer name, job title, and employment start date',
      completed: false
    },
    {
      id: 'income_proof',
      label: 'Proof of Income',
      description: 'Recent payslips, employment contract, or tax returns',
      completed: false
    },
    {
      id: 'bank_connection',
      label: 'Bank Account Connection',
      description: 'Securely connect your bank account via Plaid',
      completed: false
    }
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Income Verification Requirements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="employer">Employer Name</Label>
            <Input id="employer" placeholder="Enter employer name" />
          </div>
          <div>
            <Label htmlFor="job_title">Job Title</Label>
            <Input id="job_title" placeholder="Enter job title" />
          </div>
          <div>
            <Label htmlFor="annual_income">Annual Income</Label>
            <Input id="annual_income" placeholder="£50,000" type="number" />
          </div>
          <div>
            <Label htmlFor="employment_start">Employment Start Date</Label>
            <Input id="employment_start" type="date" />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-text-primary">Document Upload</h4>
          {requirements.map((req) => (
            <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {req.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Upload className="w-5 h-5 text-text-muted" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-text-primary">{req.label}</p>
                  <p className="text-sm text-text-muted">{req.description}</p>
                </div>
              </div>
              {!req.completed && (
                <Button variant="outline" size="sm">
                  Upload
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Plaid Integration</h4>
          <p className="text-sm text-green-800 mb-3">
            Securely connect your bank account to verify income automatically. 
            Your login credentials are never stored.
          </p>
          <Button variant="outline" className="text-green-700 border-green-300">
            Connect Bank Account
          </Button>
        </div>

        <Button 
          className="w-full bg-primary hover:bg-primary-dark text-white"
          disabled={verificationState.income_verified}
          onClick={refresh}
        >
          {verificationState.income_verified ? 'Verified' : 'Verify Income'}
        </Button>
      </CardContent>
    </Card>
  )
}