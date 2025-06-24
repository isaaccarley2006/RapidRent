
import React from 'react'
import { AppLayout } from '@/components/layouts/AppLayout'
import { useAuth } from '@/contexts/AuthContext'

const Profile: React.FC = () => {
  const { user, signOut } = useAuth()

  return (
    <AppLayout>
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">
              Profile
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your account settings and preferences
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Account Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-gray-900">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={signOut}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default Profile
