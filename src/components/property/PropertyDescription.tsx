
import React from 'react'

interface PropertyDescriptionProps {
  description: string | null
}

export const PropertyDescription: React.FC<PropertyDescriptionProps> = ({
  description
}) => {
  return (
    <div className="space-y-8">
      {description && (
        <div className="space-y-4">
          <h2 className="text-2xl font-medium text-foreground">
            About this property
          </h2>
          <div className="prose max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
