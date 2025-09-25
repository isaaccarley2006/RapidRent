import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreditCard } from 'lucide-react'
import { TenantProfile } from '@/types/profile'

interface FinancialCardProps {
  formData: Partial<TenantProfile>
  setFormData: (data: Partial<TenantProfile>) => void
}

export const FinancialCard: React.FC<FinancialCardProps> = ({
  formData,
  setFormData
}) => {
  const completedFields = [
    formData.bank_name,
    formData.account_holder_name,
    formData.sort_code,
    formData.credit_score
  ].filter(Boolean).length

  const totalFields = 4
  const completionPercentage = Math.round((completedFields / totalFields) * 100)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-primary" />
            </div>
            Financial Information
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
            <Label htmlFor="credit_score">Credit Score</Label>
            <Input
              id="credit_score"
              type="number"
              value={formData.credit_score || ''}
              onChange={(e) => setFormData({...formData, credit_score: parseInt(e.target.value) || 0})}
              placeholder="e.g. 750"
              min="300"
              max="850"
            />
          </div>
          
          <div>
            <Label htmlFor="bank_name">Bank Name *</Label>
            <Input
              id="bank_name"
              value={formData.bank_name || ''}
              onChange={(e) => setFormData({...formData, bank_name: e.target.value})}
              placeholder="Your bank name"
            />
          </div>
          
          <div>
            <Label htmlFor="account_holder_name">Account Holder Name *</Label>
            <Input
              id="account_holder_name"
              value={formData.account_holder_name || ''}
              onChange={(e) => setFormData({...formData, account_holder_name: e.target.value})}
              placeholder="Name on bank account"
            />
          </div>
          
          <div>
            <Label htmlFor="sort_code">Sort Code</Label>
            <Input
              id="sort_code"
              value={formData.sort_code || ''}
              onChange={(e) => setFormData({...formData, sort_code: e.target.value})}
              placeholder="XX-XX-XX"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}