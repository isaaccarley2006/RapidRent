import React from 'react'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { AppLayout } from '@/components/layouts/AppLayout'

interface LandlordLayoutProps {
  children: React.ReactNode
}

export const LandlordLayout: React.FC<LandlordLayoutProps> = ({ children }) => {
  return (
    <RoleGuard requiredRole="landlord">
      <AppLayout>
        {children}
      </AppLayout>
    </RoleGuard>
  )
}