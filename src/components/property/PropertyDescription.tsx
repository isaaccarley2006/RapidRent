
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
        
        <div className="space-y-4">
          {(description || 'This beautiful property offers modern living with thoughtfully designed spaces and premium finishes throughout. Perfect for those seeking comfort and style in an ideal location. The property features contemporary amenities and is located in a vibrant neighborhood with excellent transport links.')
            .split('. ')
            .filter(point => point.trim().length > 0)
            .map((point, index) => (
              <div 
                key={index} 
                className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border/50 hover:border-primary/20 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-base leading-7 text-muted-foreground font-normal">
                  {point.trim()}{point.endsWith('.') ? '' : '.'}
                </p>
              </div>
            ))}
        </div>
      </div>

    </div>
  )
}
