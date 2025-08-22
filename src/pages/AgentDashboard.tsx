import React from 'react'
import { SEOHead } from '@/components/common/SEOHead'
import { TenantSearchFilters } from '@/components/agent/TenantSearchFilters'
import { TenantList } from '@/components/agent/TenantList'

const AgentDashboard: React.FC = () => {
  return (
    <>
      <SEOHead 
        title="Agent Dashboard - View Tenant Reference Checks"
        description="Access and review tenant reference check data, verification status, and rental history."
      />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agent Dashboard</h1>
            <p className="text-muted-foreground">
              Access tenant reference checks and verification status
            </p>
          </div>
          
          <TenantSearchFilters />
          <TenantList />
        </div>
      </div>
    </>
  )
}

export default AgentDashboard