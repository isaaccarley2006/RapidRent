import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, Check, X, User, DollarSign, Mail, Phone } from 'lucide-react'
import { format } from 'date-fns'

interface OfferWithDetails {
  id: string
  offer_price: number
  status: string
  preferred_move_in_date: string | null
  tenant_message: string | null
  created_at: string
  properties: {
    title: string
    location: string | null
    price: number | null
  } | null
  profiles: {
    full_name: string | null
    email: string | null
    phone: string | null
    employment_status: string | null
    annual_income: number | null
    current_rental_situation: string | null
    has_pets: boolean | null
    pet_details: string | null
    is_smoker: boolean | null
    tenant_references: string | null
    additional_notes: string | null
  } | null
}

interface OfferDetailsDialogProps {
  offer: OfferWithDetails
  updating: string | null
  onUpdateStatus: (offerId: string, status: 'accepted' | 'rejected') => void
}

export const OfferDetailsDialog: React.FC<OfferDetailsDialogProps> = ({
  offer,
  updating,
  onUpdateStatus
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount)
  }

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Offer Details</DialogTitle>
        <DialogDescription>
          Review tenant profile and offer details
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
        {/* Offer Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Offer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Property</label>
              <p className="font-medium">{offer.properties?.title || 'Property not found'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Offer Price</label>
              <p className="font-medium text-lg">{formatCurrency(offer.offer_price)}/month</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Move-in Date</label>
              <p>{offer.preferred_move_in_date ? 
                format(new Date(offer.preferred_move_in_date), 'MMMM d, yyyy') : 
                'Not specified'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Submitted</label>
              <p>{format(new Date(offer.created_at), 'MMMM d, yyyy')}</p>
            </div>
            {offer.tenant_message && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Message</label>
                <p className="italic">"{offer.tenant_message}"</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tenant Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Tenant Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="font-medium">{offer.profiles?.full_name || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Contact</label>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{offer.profiles?.email || 'No email'}</span>
                </div>
                {offer.profiles?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{offer.profiles.phone}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Employment</label>
              <p>{offer.profiles?.employment_status || 'Not specified'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Annual Income</label>
              <p>{offer.profiles?.annual_income ? 
                formatCurrency(offer.profiles.annual_income) : 
                'Not disclosed'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Current Situation</label>
              <p>{offer.profiles?.current_rental_situation || 'Not specified'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Pets</label>
                <p>{offer.profiles?.has_pets ? 'Yes' : 'No'}</p>
                {offer.profiles?.has_pets && offer.profiles?.pet_details && (
                  <p className="text-sm text-muted-foreground italic">{offer.profiles.pet_details}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Smoker</label>
                <p>{offer.profiles?.is_smoker ? 'Yes' : 'No'}</p>
              </div>
            </div>
            {offer.profiles?.tenant_references && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">References</label>
                <p className="text-sm">{offer.profiles.tenant_references}</p>
              </div>
            )}
            {offer.profiles?.additional_notes && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Additional Notes</label>
                <p className="text-sm">{offer.profiles.additional_notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {offer.status === 'pending' && (
        <div className="flex justify-end gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => onUpdateStatus(offer.id, 'rejected')}
            disabled={updating === offer.id}
            className="hover-scale"
          >
            <X className="w-4 h-4 mr-2" />
            Reject
          </Button>
          <Button
            onClick={() => onUpdateStatus(offer.id, 'accepted')}
            disabled={updating === offer.id}
            className="hover-scale"
          >
            {updating === offer.id ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            Accept
          </Button>
        </div>
      )}
    </DialogContent>
  )
}