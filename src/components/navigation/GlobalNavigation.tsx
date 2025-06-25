
import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { Menu, X } from 'lucide-react'

interface NavigationProps {
  userType?: 'tenant' | 'landlord'
}

export const GlobalNavigation: React.FC<NavigationProps> = ({ userType }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="text-2xl font-bold text-text-primary cursor-pointer"
            onClick={() => navigate('/')}
          >
            Rent<span className="text-primary">View</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Public Links */}
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

            {user ? (
              <>
                {/* Authenticated User Links */}
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
                  className="border-text-muted text-text-primary hover:bg-gray-50 rounded-xl"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                {/* Public User Links */}
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

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-text-primary hover:text-primary transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => {
                  navigate('/')
                  setIsMobileMenuOpen(false)
                }}
                className={`px-3 py-2 text-left text-sm font-medium transition-colors ${
                  isActivePath('/') 
                    ? 'text-primary font-semibold' 
                    : 'text-text-primary hover:text-primary'
                }`}
              >
                Home
              </button>

              <button 
                onClick={() => {
                  navigate('/listings')
                  setIsMobileMenuOpen(false)
                }}
                className={`px-3 py-2 text-left text-sm font-medium transition-colors ${
                  isActivePath('/listings') 
                    ? 'text-primary font-semibold' 
                    : 'text-text-primary hover:text-primary'
                }`}
              >
                Listings
              </button>

              {user ? (
                <>
                  <button 
                    onClick={() => {
                      navigate(getDashboardPath())
                      setIsMobileMenuOpen(false)
                    }}
                    className={`px-3 py-2 text-left text-sm font-medium transition-colors ${
                      isActivePath('/dashboard') 
                        ? 'text-primary font-semibold' 
                        : 'text-text-primary hover:text-primary'
                    }`}
                  >
                    Dashboard
                  </button>

                  {userType === 'landlord' && (
                    <button 
                      onClick={() => {
                        navigate('/create-listing')
                        setIsMobileMenuOpen(false)
                      }}
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
                    onClick={() => {
                      handleSignOut()
                      setIsMobileMenuOpen(false)
                    }}
                    className="px-3 py-2 text-left text-sm font-medium text-text-primary hover:text-primary transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      navigate('/auth')
                      setIsMobileMenuOpen(false)
                    }}
                    className="px-3 py-2 text-left text-sm font-medium text-text-primary hover:text-primary transition-colors"
                  >
                    Sign In
                  </button>

                  <Button 
                    onClick={() => {
                      navigate('/auth')
                      setIsMobileMenuOpen(false)
                    }}
                    className="bg-primary hover:bg-primary-dark text-white rounded-xl font-medium mx-3 mt-2"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
