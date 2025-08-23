import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, Check, X, Banknote } from 'lucide-react'
import { format } from 'date-fns'
import { TenantCard } from './TenantCard'

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
    date_of_birth: string | null
    national_insurance_number: string | null
    current_address: string | null
    previous_address: string | null
    time_at_current_address: string | null
    employment_status: string | null
    employer_name: string | null
    employer_address: string | null
    job_title: string | null
    employment_start_date: string | null
    annual_income: number | null
    credit_score: number | null
    bank_name: string | null
    account_holder_name: string | null
    sort_code: string | null
    has_pets: boolean | null
    pet_details: string | null
    is_smoker: boolean | null
    tenant_references: string | null
    additional_notes: string | null
    emergency_contact_name: string | null
    emergency_contact_phone: string | null
    emergency_contact_relationship: string | null
    identity_verified: boolean | null
    employment_verified: boolean | null
    income_verified: boolean | null
    credit_verified: boolean | null
    references_verified: boolean | null
    bank_verified: boolean | null
    profile_completion_percentage: number | null
    current_rental_situation: string | null
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
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
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
              <Banknote className="w-5 h-5 text-primary" />
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

        {/* Tenant Profile Card */}
        {offer.profiles && (
          <TenantCard
            profile={offer.profiles}
            offerPrice={offer.offer_price}
            listedPrice={offer.properties?.price || null}
            showFullDetails={true}
          />
        )}
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