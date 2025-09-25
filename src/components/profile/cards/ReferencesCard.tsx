import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserCheck, Plus, Phone, Mail, Building } from 'lucide-react'
import { TenantReference } from '@/types/profile'

interface ReferencesCardProps {
  references: TenantReference[]
  addReference: (reference: any) => void
}

export const ReferencesCard: React.FC<ReferencesCardProps> = ({
  references,
  addReference
}) => {
  const [showAddForm, setShowAddForm] = useState(false)
  
  const completionPercentage = references.length > 0 ? 100 : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-primary" />
            </div>
            References
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-sm text-muted-foreground">{completionPercentage}% complete</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {references.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No references added yet</p>
              <p className="text-xs">Add landlord or employer references to strengthen your profile</p>
            </div>
          ) : (
            references.map((reference) => (
              <div key={reference.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{reference.contact_name}</span>
                  </div>
                  <Badge variant="outline" className={getStatusColor(reference.verification_status)}>
                    {reference.verification_status}
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="capitalize">{reference.reference_type} Reference</div>
                  {reference.company_name && (
                    <div className="flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {reference.company_name}
                    </div>
                  )}
                  {reference.contact_email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {reference.contact_email}
                    </div>
                  )}
                  {reference.contact_phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {reference.contact_phone}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Reference
        </Button>
      </CardContent>
    </Card>
  )
}