
import React from 'react'
import { AppLayout } from '@/components/layouts/AppLayout'

const Listings: React.FC = () => {
  return (
    <AppLayout>
      <div className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Listings
          </h1>
          <p className="text-gray-600 mt-2">
            Browse and manage property listings
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center">
            <p className="text-gray-500">
              Listings interface will be implemented here
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default Listings
