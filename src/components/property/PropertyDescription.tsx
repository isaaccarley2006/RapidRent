
import React from 'react'
import { OverviewCard } from './OverviewCard'
import { LeaseDetailsCard } from './LeaseDetailsCard'
import { KeyFeaturesCard } from './KeyFeaturesCard'

interface PropertyDescriptionProps {
  description: string | null
}

export const PropertyDescription: React.FC<PropertyDescriptionProps> = ({
  description
}) => {
  return (
    <div className="space-y-12">
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-medium text-foreground">
            About this property
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <OverviewCard />
          <LeaseDetailsCard />
          <KeyFeaturesCard />
        </div>
      </div>
    </div>
  )
}
