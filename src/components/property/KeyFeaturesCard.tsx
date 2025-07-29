import React from 'react'

export const KeyFeaturesCard: React.FC = () => {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Key Features</h3>
      <div className="grid grid-cols-2 gap-y-2 text-sm">
        <div className="text-muted-foreground">Pet Friendly</div>
        <div className="font-medium text-foreground">No</div>
        
        <div className="text-muted-foreground">Parking</div>
        <div className="font-medium text-foreground">Street</div>
        
        <div className="text-muted-foreground">Garden Access</div>
        <div className="font-medium text-foreground">Shared</div>
        
        <div className="text-muted-foreground">Outdoor Space</div>
        <div className="font-medium text-foreground">Balcony</div>
      </div>
    </div>
  )
}