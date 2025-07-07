import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Loader2, Eye, Check, X, User, Mail, Phone, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { OfferDetailsDialog } from './OfferDetailsDialog'

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

interface OfferCardProps {
  offer: OfferWithDetails
  updating: string | null
  onUpdateStatus: (offerId: string, status: 'accepted' | 'rejected') => void
  onSelectOffer: (offer: OfferWithDetails) => void
}

export const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  updating,
  onUpdateStatus,
  onSelectOffer
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount)
  }

  return (
    <Card className="relative overflow-hidden border border-border hover:shadow-md transition-shadow animate-fade-in">
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <Badge className={getStatusColor(offer.status)}>
          {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-foreground pr-20">
            {offer.properties?.title || 'Property not found'}
          </h3>
          {offer.properties?.location && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span className="text-sm">{offer.properties.location}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Applicant Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">
              {offer.profiles?.full_name || 'Unknown Applicant'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-3 h-3" />
            <span className="text-sm">{offer.profiles?.email || 'No email'}</span>
          </div>
          {offer.profiles?.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-3 h-3" />
              <span className="text-sm">{offer.profiles.phone}</span>
            </div>
          )}
        </div>

        {/* Offer Details */}
        <div className="space-y-3 p-3 bg-secondary/20 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Offer Amount</span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(offer.offer_price)}/month
            </span>
          </div>
          
          {offer.properties?.price && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Listed Price</span>
              <span className="text-sm text-muted-foreground">
                {formatCurrency(offer.properties.price)}/month
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Move-in Date</span>
            <span className="text-sm font-medium">
              {offer.preferred_move_in_date ? 
                format(new Date(offer.preferred_move_in_date), 'MMM d, yyyy') : 
                'Flexible'
              }
            </span>
          </div>
        </div>

        {/* Key Applicant Details */}
        <div className="space-y-2">
          {offer.profiles?.employment_status && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Employment</span>
              <span className="text-sm font-medium">{offer.profiles.employment_status}</span>
            </div>
          )}
          
          {offer.profiles?.annual_income && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Annual Income</span>
              <span className="text-sm font-medium">
                {formatCurrency(offer.profiles.annual_income)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Pets</span>
            <span className="text-sm">{offer.profiles?.has_pets ? 'Yes' : 'No'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Smoker</span>
            <span className="text-sm">{offer.profiles?.is_smoker ? 'Yes' : 'No'}</span>
          </div>
        </div>

        {/* Message Preview */}
        {offer.tenant_message && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Message:</p>
            <p className="text-sm italic line-clamp-2">"{offer.tenant_message}"</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onSelectOffer(offer)}
                className="flex-1 hover-scale"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </DialogTrigger>
            <OfferDetailsDialog 
              offer={offer}
              updating={updating}
              onUpdateStatus={onUpdateStatus}
            />
          </Dialog>

          {offer.status === 'pending' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateStatus(offer.id, 'rejected')}
                disabled={updating === offer.id}
                className="px-3 hover-scale"
              >
                <X className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={() => onUpdateStatus(offer.id, 'accepted')}
                disabled={updating === offer.id}
                className="px-3 hover-scale"
              >
                {updating === offer.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}