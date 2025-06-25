
import React from 'react'
import { NavigationWrapper } from '@/components/navigation/NavigationWrapper'

interface AppLayoutProps {
  children: React.ReactNode
  showNavigation?: boolean
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, showNavigation = true }) => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {showNavigation && <NavigationWrapper />}
      <div className="mx-auto max-w-7xl">
        {children}
      </div>
    </div>
  )
}
