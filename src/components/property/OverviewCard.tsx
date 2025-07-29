import React from 'react'

export const OverviewCard: React.FC = () => {
  return (
    <div className="bg-card border border-border rounded-xl p-8">
      <h3 className="text-lg font-medium text-foreground mb-8">Overview</h3>
      <div className="space-y-[5px]">
        {[
          { label: "Location", value: "Central London" },
          { label: "Property Type", value: "Apartment" },
          { label: "Bedrooms", value: "2" },
          { label: "Bathrooms", value: "1" },
          { label: "Furnished", value: "Yes" }
        ].map((item, index) => (
          <div key={index} className="flex justify-between items-center min-h-[24px]">
            <span className="text-sm text-muted-foreground flex-shrink-0 mr-4">{item.label}</span>
            <span className="text-sm font-medium text-foreground text-right flex-shrink-0 min-w-[80px]">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}