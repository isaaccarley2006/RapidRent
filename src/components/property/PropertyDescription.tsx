
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overview Card */}
          <div className="bg-muted/30 rounded-xl shadow-sm p-6 space-y-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-foreground mb-4">Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Location</span>
                <span className="text-sm font-medium text-foreground">Central London</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Type</span>
                <span className="text-sm font-medium text-foreground">Apartment</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bedrooms</span>
                <span className="text-sm font-medium text-foreground">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bathrooms</span>
                <span className="text-sm font-medium text-foreground">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Furnished</span>
                <span className="text-sm font-medium text-foreground">Yes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Deposit</span>
                <span className="text-sm font-medium text-foreground">£2,400</span>
              </div>
            </div>
          </div>

          {/* Lease Details Card */}
          <div className="bg-muted/30 rounded-xl shadow-sm p-6 space-y-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h3 className="text-lg font-semibold text-foreground mb-4">Lease Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Available From</span>
                <span className="text-sm font-medium text-foreground">Immediately</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Minimum Lease</span>
                <span className="text-sm font-medium text-foreground">12 months</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bills Included</span>
                <span className="text-sm font-medium text-foreground">Partially</span>
              </div>
            </div>
          </div>

          {/* Key Features Card */}
          <div className="bg-muted/30 rounded-xl shadow-sm p-6 space-y-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h3 className="text-lg font-semibold text-foreground mb-4">Key Features</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pet Friendly</span>
                <span className="text-sm font-medium text-foreground">No</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Parking</span>
                <span className="text-sm font-medium text-foreground">Street</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Garden</span>
                <span className="text-sm font-medium text-foreground">Shared</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Balcony</span>
                <span className="text-sm font-medium text-foreground">Yes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
