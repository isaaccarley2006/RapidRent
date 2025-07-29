import React from 'react'

export const LeaseDetailsCard: React.FC = () => {
  return (
    <div className="bg-card border border-border rounded-xl p-8">
      <h3 className="text-lg font-medium text-foreground mb-8">Lease Details</h3>
      <div className="space-y-[5px]">
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
  )
}