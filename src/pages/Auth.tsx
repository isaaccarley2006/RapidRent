
import React from 'react'
import { AuthLayout } from '@/components/layouts/AuthLayout'

const Auth: React.FC = () => {
  return (
    <AuthLayout>
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Welcome to RentView
        </h1>
        <p className="text-gray-600 mb-8">
          Sign in to continue to your account
        </p>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-500">
              Authentication components will be implemented here
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Auth
