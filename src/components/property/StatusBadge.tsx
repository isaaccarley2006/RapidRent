
import React from 'react'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'listed':
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rented':
      case 'unavailable':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-muted text-text-muted border-muted'
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'listed':
        return 'Available'
      case 'pending':
        return 'Pending'
      case 'rented':
        return 'Rented'
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  return (
    <span 
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
        getStatusStyles(status),
        className
      )}
    >
      {getStatusText(status)}
    </span>
  )
}
