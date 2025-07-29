import React from 'react'

export const LeaseDetailsCard: React.FC = () => {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Lease Details</h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center p-2 rounded-md border border-border/30 bg-muted/20">
          <div className="text-sm text-muted-foreground">Available From</div>
          <div className="text-sm font-medium text-foreground">Immediately</div>
        </div>
        
        <div className="flex justify-between items-center p-2 rounded-md border border-border/30 bg-muted/20">
          <div className="text-sm text-muted-foreground">Minimum Lease</div>
          <div className="text-sm font-medium text-foreground">12 months</div>
        </div>
        
        <div className="flex justify-between items-center p-2 rounded-md border border-border/30 bg-muted/20">
          <div className="text-sm text-muted-foreground">Bills Included</div>
          <div className="text-sm font-medium text-foreground">Partially</div>
        </div>
        
        <div className="flex justify-between items-center p-2 rounded-md border border-border/30 bg-muted/20">
          <div className="text-sm text-muted-foreground">Security Deposit</div>
          <div className="text-sm font-medium text-foreground">£2,400</div>
        </div>
      </div>
    </div>
  )
}