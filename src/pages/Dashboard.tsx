
import React, { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layouts/AppLayout'
import { TenantDashboard } from '@/components/dashboard/TenantDashboard'
import { LandlordDashboard } from '@/components/dashboard/LandlordDashboard'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [userType, setUserType] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_type, full_name')
          .eq('id', user.id)
          .single()

        if (error) throw error
        setUserType(data?.user_type || null)
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [user])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <AppLayout>
      <div className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-text-primary">
            Dashboard
          </h1>
          <p className="text-text-muted mt-2">
            Welcome back, {user?.email}
          </p>
        </div>
        
        {userType === 'landlord' ? <LandlordDashboard /> : <TenantDashboard />}
      </div>
    </AppLayout>
  )
}

export default Dashboard
