
import React from 'react'
import { CardContent } from '@/components/ui/card'

interface PropertyDescriptionProps {
  description: string | null
}

export const PropertyDescription: React.FC<PropertyDescriptionProps> = ({
  description
}) => {
  return (
    <CardContent>
      <div className="prose max-w-none">
        <h3 className="text-xl font-semibold text-text-primary mb-4">
          Description
        </h3>
        <p className="text-text-muted leading-relaxed">
          {description || 'No description available for this property.'}
        </p>
      </div>
    </CardContent>
  )
}
