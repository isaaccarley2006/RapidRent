
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

interface DesktopNavigationProps {
  userType?: 'tenant' | 'landlord'
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ userType }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
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

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {user ? (
        <>
          {/* Authenticated User Links - No Home button */}
          <button 
            onClick={() => navigate(getDashboardPath())}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              isActivePath('/dashboard') 
                ? 'text-primary font-semibold' 
                : 'text-text-primary hover:text-primary'
            }`}
          >
            Dashboard
          </button>

          <button 
            onClick={() => navigate('/listings')}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              isActivePath('/listings') 
                ? 'text-primary font-semibold' 
                : 'text-text-primary hover:text-primary'
            }`}
          >
            Listings
          </button>

          {userType === 'landlord' && (
            <button 
              onClick={() => navigate('/create-listing')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActivePath('/create-listing') 
                  ? 'text-primary font-semibold' 
                  : 'text-text-primary hover:text-primary'
              }`}
            >
              Create Listing
            </button>
          )}

          <Button
            onClick={handleSignOut}
            variant="outline"
            className="border-muted text-text-primary hover:bg-surface rounded-xl"
          >
            Sign Out
          </Button>
        </>
      ) : (
        <>
          {/* Public User Links */}
          <button 
            onClick={() => navigate('/')}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              isActivePath('/') 
                ? 'text-primary font-semibold' 
                : 'text-text-primary hover:text-primary'
            }`}
          >
            Home
          </button>

          <button 
            onClick={() => navigate('/listings')}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              isActivePath('/listings') 
                ? 'text-primary font-semibold' 
                : 'text-text-primary hover:text-primary'
            }`}
          >
            Listings
          </button>

          <button 
            onClick={() => navigate('/auth')}
            className="px-3 py-2 text-sm font-medium text-text-primary hover:text-primary transition-colors"
          >
            Sign In
          </button>

          <Button 
            onClick={() => navigate('/auth')}
            className="bg-primary hover:bg-primary-dark text-white rounded-xl font-medium"
          >
            Get Started
          </Button>
        </>
      )}
    </nav>
  )
}
