
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export const Navigation: React.FC = () => {
  const navigate = useNavigate()

  return (
    <header className="border-b border-muted bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-text-primary">
            Rapid<span className="text-primary">Rent</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigate('/listings')}
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              Properties
            </button>
            <button 
              onClick={() => navigate('/auth/tenant')}
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              Sign In
            </button>
            <Button 
              onClick={() => navigate('/auth/tenant')}
              className="bg-primary hover:bg-primary-dark text-white rounded-xl"
            >
              Get Started
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
