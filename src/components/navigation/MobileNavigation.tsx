
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

interface MobileNavigationProps {
  userType?: 'tenant' | 'landlord'
  isOpen: boolean
  onClose: () => void
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  userType, 
  isOpen, 
  onClose 
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
    onClose()
  }

  const isActivePath = (path: string) => {
    if (path === '/dashboard' && userType) {
      return location.pathname === `/dashboard/${userType}`
    }
    return location.pathname === path
  }

  const getDashboardPath = () => {
    return userType ? `/dashboard/${userType}` : '/dashboard'
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="md:hidden border-t border-muted py-4">
      <div className="flex flex-col space-y-3">
        {user ? (
          <>
            {/* Authenticated Mobile Links - No Home button */}
            <button 
              onClick={() => handleNavigation(getDashboardPath())}
              className={`px-3 py-2 text-left text-sm font-medium transition-colors ${
                isActivePath('/dashboard') 
                  ? 'text-primary font-semibold' 
                  : 'text-text-primary hover:text-primary'
              }`}
            >
              Dashboard
            </button>

            <button 
              onClick={() => handleNavigation('/listings')}
              className={`px-3 py-2 text-left text-sm font-medium transition-colors ${
                isActivePath('/listings') 
                  ? 'text-primary font-semibold' 
                  : 'text-text-primary hover:text-primary'
              }`}
            >
              Listings
            </button>

            {userType === 'landlord' && (
              <button 
                onClick={() => handleNavigation('/create-listing')}
                className={`px-3 py-2 text-left text-sm font-medium transition-colors ${
                  isActivePath('/create-listing') 
                    ? 'text-primary font-semibold' 
                    : 'text-text-primary hover:text-primary'
                }`}
              >
                Create Listing
              </button>
            )}

            <button
              onClick={handleSignOut}
              className="px-3 py-2 text-left text-sm font-medium text-text-primary hover:text-primary transition-colors"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            {/* Public Mobile Links */}
            <button 
              onClick={() => handleNavigation('/')}
              className={`px-3 py-2 text-left text-sm font-medium transition-colors ${
                isActivePath('/') 
                  ? 'text-primary font-semibold' 
                  : 'text-text-primary hover:text-primary'
              }`}
            >
              Home
            </button>

            <button 
              onClick={() => handleNavigation('/listings')}
              className={`px-3 py-2 text-left text-sm font-medium transition-colors ${
                isActivePath('/listings') 
                  ? 'text-primary font-semibold' 
                  : 'text-text-primary hover:text-primary'
              }`}
            >
              Listings
            </button>

            <button 
              onClick={() => handleNavigation('/auth')}
              className="px-3 py-2 text-left text-sm font-medium text-text-primary hover:text-primary transition-colors"
            >
              Sign In
            </button>

            <Button 
              onClick={() => handleNavigation('/auth')}
              className="bg-primary hover:bg-primary-dark text-white rounded-xl font-medium mx-3 mt-2"
            >
              Get Started
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
