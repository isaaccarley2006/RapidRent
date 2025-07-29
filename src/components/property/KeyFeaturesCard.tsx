import React from 'react'

export const KeyFeaturesCard: React.FC = () => {
  return (
    <div className="bg-card border border-border rounded-xl p-8">
      <h3 className="text-lg font-medium text-foreground mb-8">Key Features</h3>
      <div className="space-y-[5px]">
        {[
          { label: "Pet Friendly", value: "No" },
          { label: "Parking", value: "Street" },
          { label: "Garden Access", value: "Shared" },
          { label: "Outdoor Space", value: "Balcony" }
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