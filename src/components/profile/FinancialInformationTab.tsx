import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreditCard } from 'lucide-react'
import { TenantProfile } from '@/types/profile'

interface FinancialInformationTabProps {
  formData: Partial<TenantProfile>
  setFormData: (data: Partial<TenantProfile>) => void
}

export const FinancialInformationTab: React.FC<FinancialInformationTabProps> = ({
  formData,
  setFormData
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          Financial Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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