import React from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface RoleSelectionModuleProps {
  setValue: any
  errors: any
}

export const RoleSelectionModule: React.FC<RoleSelectionModuleProps> = ({ setValue, errors }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Role Information
      </h3>
      
      <div className="space-y-2">
        <Label className="text-text-primary font-medium">
          I am a...
        </Label>
        <Select onValueChange={(value) => setValue('role', value as any)}>
          <SelectTrigger className="h-12 border-muted focus:border-primary focus:ring-primary">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent className="bg-background border-muted z-50">
            <SelectItem value="tenant">Tenant - Looking for a property</SelectItem>
            <SelectItem value="agent">Agent - Managing properties</SelectItem>
            <SelectItem value="landlord">Landlord - Renting out property</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-sm text-destructive">{errors.role.message}</p>
        )}
      </div>
    </div>
  )
}