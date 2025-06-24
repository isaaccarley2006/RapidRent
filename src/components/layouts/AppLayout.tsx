
import React from 'react'

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl">
        {children}
      </div>
    </div>
  )
}
