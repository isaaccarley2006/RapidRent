import React from 'react'

export const OverviewCard: React.FC = () => {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Overview</h3>
      <div className="grid grid-cols-2 gap-y-2 text-sm">
        <div className="text-muted-foreground">Location</div>
        <div className="font-medium text-foreground">Central London</div>
        
        <div className="text-muted-foreground">Property Type</div>
        <div className="font-medium text-foreground">Apartment</div>
        
        <div className="text-muted-foreground">Bedrooms</div>
        <div className="font-medium text-foreground">2</div>
        
        <div className="text-muted-foreground">Bathrooms</div>
        <div className="font-medium text-foreground">1</div>
        
        <div className="text-muted-foreground">Furnished</div>
        <div className="font-medium text-foreground">Yes</div>
      </div>
    </div>
  )
}