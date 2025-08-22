import React from 'react'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { AppLayout } from '@/components/layouts/AppLayout'

interface AgentLayoutProps {
  children: React.ReactNode
}

export const AgentLayout: React.FC<AgentLayoutProps> = ({ children }) => {
  return (
    <RoleGuard requiredRole="agent">
      <AppLayout>
        {children}
      </AppLayout>
    </RoleGuard>
  )
}