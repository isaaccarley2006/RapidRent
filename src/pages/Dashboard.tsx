
import React from 'react'
import { AppLayout } from '@/components/layouts/AppLayout'
import { useAuth } from '@/contexts/AuthContext'

const Dashboard: React.FC = () => {
  const { user } = useAuth()

  return (
    <AppLayout>
      <div className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.email}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Quick Stats
            </h3>
            <p className="text-gray-500">
              Dashboard content will be implemented here
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Recent Activity
            </h3>
            <p className="text-gray-500">
              Activity feed will be shown here
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Actions
            </h3>
            <p className="text-gray-500">
              Quick actions will be available here
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default Dashboard
