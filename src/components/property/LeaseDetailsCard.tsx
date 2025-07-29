import React from 'react'

export const LeaseDetailsCard: React.FC = () => {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Lease Details</h3>
      <div className="grid grid-cols-2 gap-y-2 text-sm">
        <div className="text-muted-foreground">Available From</div>
        <div className="font-medium text-foreground">Immediately</div>
        
        <div className="text-muted-foreground">Minimum Lease</div>
        <div className="font-medium text-foreground">12 months</div>
        
        <div className="text-muted-foreground">Bills Included</div>
        <div className="font-medium text-foreground">Partially</div>
        
        <div className="text-muted-foreground">Security Deposit</div>
        <div className="font-medium text-foreground">£2,400</div>
      </div>
    </div>
  )
}