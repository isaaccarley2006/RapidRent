
import React from 'react'
import { Home } from 'lucide-react'

export const PropertyImage: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="w-full h-96 bg-surface rounded-xl flex items-center justify-center">
        <div className="text-center">
          <Home className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <p className="text-text-muted">Property Image</p>
        </div>
      </div>
    </div>
  )
}
