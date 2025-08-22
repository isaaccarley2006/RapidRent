import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '@/lib/auth/useUser'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface RoleGuardProps {
  children: React.ReactNode
  requiredRole: 'tenant' | 'landlord' | 'agent'
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, requiredRole }) => {
  const { user, profile, loading, refresh } = useUser()
  const location = useLocation()

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // Redirect to auth if no session
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  // Show error state if profile missing or no role
  if (!profile || !profile.role) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-2" />
            <CardTitle>Profile Setup Required</CardTitle>
            <CardDescription>
              Your account needs to be set up before you can access this area.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => window.location.href = '/onboarding'}
              className="w-full"
            >
              Complete Profile Setup
            </Button>
            <Button 
              variant="outline" 
              onClick={refresh}
              className="w-full"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Redirect to correct area if wrong role
  if (profile.role !== requiredRole) {
    const correctPath = profile.role === 'tenant' ? '/dashboard' : 
                       profile.role === 'landlord' ? '/dashboard' : 
                       profile.role === 'agent' ? '/agent/dashboard' : '/dashboard'
    return <Navigate to={correctPath} replace />
  }

  // Render children if all checks pass
  return <>{children}</>
}