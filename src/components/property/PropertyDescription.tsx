
import React from 'react'

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
          {/* Overview Card */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h3 className="text-lg font-medium text-foreground mb-8">Overview</h3>
            <div className="space-y-6">
              {[
                { label: "Location", value: "Central London" },
                { label: "Property Type", value: "Apartment" },
                { label: "Bedrooms", value: "2" },
                { label: "Bathrooms", value: "1" },
                { label: "Furnished", value: "Yes" },
                { label: "Security Deposit", value: "£2,400" }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lease Details Card */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h3 className="text-lg font-medium text-foreground mb-8">Lease Details</h3>
            <div className="space-y-6">
              {[
                { label: "Available From", value: "Immediately" },
                { label: "Minimum Lease", value: "12 months" },
                { label: "Bills Included", value: "Partially" }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features Card */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h3 className="text-lg font-medium text-foreground mb-8">Key Features</h3>
            <div className="space-y-6">
              {[
                { label: "Pet Friendly", value: "No" },
                { label: "Parking", value: "Street" },
                { label: "Garden Access", value: "Shared" },
                { label: "Outdoor Space", value: "Balcony" }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {description && (
        <div className="prose max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      )}
    </div>
  )
}
