
import React, { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layouts/AppLayout'
import { TenantDashboard } from '@/components/dashboard/TenantDashboard'
import { LandlordDashboard } from '@/components/dashboard/LandlordDashboard'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { useToast } from '@/hooks/use-toast'
import { useLocation } from 'react-router-dom'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const location = useLocation()
  const [userType, setUserType] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_type, full_name, email, profile_complete')
          .eq('id', user.id)
          .single()

        if (error) throw error
        
        setUserType(data?.user_type || null)
        setUserProfile(data)

        // Show welcome toast for new users (only once per session)
        if (data?.profile_complete && !sessionStorage.getItem('welcomed')) {
          const userTypeLabel = data.user_type === 'tenant' ? 'Tenant' : 'Landlord'
          toast({
            title: `Welcome back, ${data.full_name?.split(' ')[0] || 'User'}! 👋`,
            description: `Your ${userTypeLabel} dashboard is ready to use.`,
          })
          sessionStorage.setItem('welcomed', 'true')
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
        toast({
          title: "Error loading profile",
          description: "Please try refreshing the page.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [user, toast])

  if (loading) {
    return <LoadingSpinner />
  }

  // Use profile user type for display
  const displayUserType = userType

  return (
    <AppLayout>
      <div className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-text-primary">
            {displayUserType === 'tenant' ? 'Tenant Dashboard' : 
             displayUserType === 'landlord' ? 'Landlord Dashboard' : 'Dashboard'}
          </h1>
          <p className="text-text-muted mt-2">
            Welcome back, {userProfile?.full_name || user?.email}
          </p>
        </div>
        
        {displayUserType === 'landlord' ? <LandlordDashboard /> : <TenantDashboard />}
      </div>
    </AppLayout>
  )
}

export default Dashboard
