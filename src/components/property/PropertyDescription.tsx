
import React from 'react'

interface PropertyDescriptionProps {
  description: string | null
}

export const PropertyDescription: React.FC<PropertyDescriptionProps> = ({
  description
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            About this property
          </h2>
          <div className="w-12 h-0.5 bg-primary rounded-full"></div>
        </div>
        
        <div className="prose prose-neutral max-w-none">
          <p className="text-base leading-7 text-muted-foreground font-normal">
            {description || 'This beautiful property offers modern living with thoughtfully designed spaces and premium finishes throughout. Perfect for those seeking comfort and style in an ideal location.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Property Type</h4>
          <p className="text-sm text-muted-foreground">Apartment</p>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Furnished</h4>
          <p className="text-sm text-muted-foreground">Yes</p>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Available From</h4>
          <p className="text-sm text-muted-foreground">Immediately</p>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Minimum Stay</h4>
          <p className="text-sm text-muted-foreground">12 months</p>
        </div>
      </div>
    </div>
  )
}
