
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface LogoProps {
  userType?: 'tenant' | 'landlord'
}

export const Logo: React.FC<LogoProps> = ({ userType }) => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const getDashboardPath = () => {
    return userType ? `/dashboard/${userType}` : '/dashboard'
  }

  const handleLogoClick = () => {
    if (user) {
      // For authenticated users, logo takes them to dashboard
      navigate(getDashboardPath())
    } else {
      // For unauthenticated users, logo takes them to home
      navigate('/')
    }
  }

  return (
    <div 
      className="text-2xl font-bold text-text-primary cursor-pointer"
      onClick={handleLogoClick}
    >
      Rapid<span className="text-primary">Rent</span>
    </div>
  )
}
