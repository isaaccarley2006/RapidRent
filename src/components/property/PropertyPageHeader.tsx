
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export const PropertyPageHeader: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleBackToListings = () => {
    navigate('/listings')
  }

  return (
    <header className="border-b border-muted bg-card">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={handleBackToListings}
              className="p-2 text-text-muted hover:text-text-primary"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-2xl font-bold text-text-primary">
              Rent<span className="text-primary">View</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            {!user ? (
              <>
                <Button 
                  onClick={() => navigate('/auth')}
                  variant="ghost"
                  className="text-text-muted hover:text-text-primary"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-primary hover:bg-primary-dark text-white rounded-xl"
                >
                  Get Started
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-primary hover:bg-primary-dark text-white rounded-xl"
              >
                Dashboard
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
