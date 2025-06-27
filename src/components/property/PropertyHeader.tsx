
import React from 'react'
import { MapPin } from 'lucide-react'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/property/StatusBadge'

interface PropertyHeaderProps {
  title: string
  location: string | null
  status: string
}

export const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  title,
  location,
  status
}) => {
  return (
    <CardHeader>
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-3xl font-bold text-text-primary mb-2">
            {title}
          </CardTitle>
          <div className="flex items-center text-text-muted mb-4">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{location || 'Location not specified'}</span>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>
    </CardHeader>
  )
}
