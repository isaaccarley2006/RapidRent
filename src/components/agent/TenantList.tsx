import React from 'react'
import { TenantReferenceCard } from './TenantReferenceCard'
import { useAgentTenants } from '@/hooks/useAgentTenants'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Users } from 'lucide-react'

export const TenantList: React.FC = () => {
  const { tenants, loading, error } = useAgentTenants()

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load tenant data. Please try again.
        </AlertDescription>
      </Alert>
    )
  }

  if (!tenants || tenants.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Tenants Found
        </h3>
        <p className="text-muted-foreground">
          No tenants have granted you access to their reference check data yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Tenant Reference Checks ({tenants.length})
        </h2>
      </div>
      
      <div className="grid gap-4">
        {tenants.map((tenant) => (
          <TenantReferenceCard key={tenant.id} tenant={tenant} />
        ))}
      </div>
    </div>
  )
}