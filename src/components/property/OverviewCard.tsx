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
  )
}