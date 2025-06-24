
import React from 'react'
import { AppLayout } from '@/components/layouts/AppLayout'

const Onboarding: React.FC = () => {
  return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">
            Welcome to RentView
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Let's get you set up with your profile
          </p>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <p className="text-gray-500">
              Onboarding flow will be implemented here
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default Onboarding
