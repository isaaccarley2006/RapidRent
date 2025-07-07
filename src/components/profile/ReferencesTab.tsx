import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Plus, Mail, Phone, Check, Clock } from 'lucide-react'
import { TenantReference } from '@/types/profile'
import { useToast } from '@/hooks/use-toast'

interface ReferencesTabProps {
  references: TenantReference[]
  addReference: (referenceData: {
    reference_type: string
    contact_name: string
    contact_email?: string
    contact_phone?: string
    company_name?: string
    relationship?: string
    reference_period?: string
    notes?: string
  }) => void
}

export const ReferencesTab: React.FC<ReferencesTabProps> = ({
  references,
  addReference
}) => {
  const { toast } = useToast()

  const getVerificationColor = (verified: boolean) => {
    return verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
  }

  const getVerificationIcon = (verified: boolean) => {
    return verified ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          References
        </CardTitle>
        <CardDescription>
          Add references from previous landlords, employers, or character references
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {references.map((reference) => (
            <div key={reference.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{reference.contact_name}</h4>
                  <p className="text-sm text-text-muted capitalize">
                    {reference.reference_type.replace('_', ' ')} Reference
                  </p>
                  {reference.company_name && (
                    <p className="text-sm text-text-muted">{reference.company_name}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm text-text-muted">
                    {reference.contact_email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {reference.contact_email}
                      </span>
                    )}
                    {reference.contact_phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {reference.contact_phone}
                      </span>
                    )}
                  </div>
                </div>
                <Badge className={getVerificationColor(reference.verification_status === 'verified')}>
                  {getVerificationIcon(reference.verification_status === 'verified')}
                  {reference.verification_status === 'verified' ? 'Verified' : 'Pending'}
                </Badge>
              </div>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            className="w-full border-dashed"
            onClick={() => {
              // Add reference form logic here
              toast({
                title: "Coming Soon",
                description: "Reference management will be available soon."
              })
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Reference
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}