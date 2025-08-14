import React from 'react'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { AppLayout } from '@/components/layouts/AppLayout'

interface RenterLayoutProps {
  children: React.ReactNode
}

export const RenterLayout: React.FC<RenterLayoutProps> = ({ children }) => {
  return (
    <RoleGuard requiredRole="tenant">
      <AppLayout>
        {children}
      </AppLayout>
    </RoleGuard>
  )
}