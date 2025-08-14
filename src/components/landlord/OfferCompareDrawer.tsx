import React from 'react'
import { format } from 'date-fns'
import { X } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { OfferRow } from '@/types/offers'

interface OfferCompareDrawerProps {
  offers: OfferRow[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onClearSelection: () => void
}

export const OfferCompareDrawer: React.FC<OfferCompareDrawerProps> = ({
  offers,
  open,
  onOpenChange,
  onClearSelection
}) => {
  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Not specified'
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (date: string | null) => {
    if (!date) return 'Not specified'
    try {
      return format(new Date(date), 'MMM d, yyyy')
    } catch {
      return 'Invalid date'
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      submitted: 'default',
      shortlisted: 'secondary',
      accepted: 'default',
      rejected: 'destructive'
    } as const

    const colors = {
      submitted: '',
      shortlisted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      rejected: ''
    }

    return (
      <Badge 
        variant={variants[status as keyof typeof variants] || 'default'} 
        className={colors[status as keyof typeof colors] || ''}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  // Helper to highlight differences
  const getValue = (offers: OfferRow[], index: number, field: keyof OfferRow) => {
    return offers[index]?.[field]
  }

  const hasVariation = (field: keyof OfferRow) => {
    const values = offers.map(offer => offer[field])
    return new Set(values).size > 1
  }

  const ComparisonRow = ({ 
    label, 
    values, 
    highlight = false 
  }: { 
    label: string
    values: (string | React.ReactNode)[]
    highlight?: boolean 
  }) => (
    <div className={`grid grid-cols-${offers.length + 1} gap-4 py-3 ${highlight ? 'bg-accent/50' : ''}`}>
      <div className="font-medium text-sm">{label}</div>
      {values.map((value, index) => (
        <div key={index} className={`text-sm ${highlight ? 'font-medium' : ''}`}>
          {value}
        </div>
      ))}
    </div>
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-4xl">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Compare Offers</SheetTitle>
              <SheetDescription>
                Comparing {offers.length} selected offers side by side
              </SheetDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSelection}
            >
              Clear Selection
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Header with offer identifiers */}
          <div className={`grid grid-cols-${offers.length + 1} gap-4 pb-4 border-b`}>
            <div className="font-semibold">Field</div>
            {offers.map((offer, index) => (
              <div key={offer.id} className="space-y-2">
                <div className="font-semibold text-sm">
                  Offer {index + 1}
                </div>
                <div className="text-xs text-muted-foreground">
                  {offer.renter?.name || 'Renter'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(offer.created_at), 'MMM d, yyyy')}
                </div>
              </div>
            ))}
          </div>

          {/* Property Information */}
          <div className="space-y-1">
            <h3 className="font-semibold text-base mb-3">Property</h3>
            <ComparisonRow
              label="Property"
              values={offers.map(offer => offer.property?.title || 'Unknown')}
              highlight={hasVariation('property')}
            />
            <ComparisonRow
              label="Location"
              values={offers.map(offer => offer.property?.location || 'Not specified')}
            />
          </div>

          <Separator />

          {/* Offer Details */}
          <div className="space-y-1">
            <h3 className="font-semibold text-base mb-3">Offer Details</h3>
            <ComparisonRow
              label="Monthly Rent"
              values={offers.map(offer => (
                <div className="space-y-1">
                  <div className="font-medium">{formatCurrency(offer.monthly_rent)}</div>
                  {offer.property?.price && offer.monthly_rent && (
                    <div className="text-xs">
                      {offer.monthly_rent > offer.property.price ? (
                        <span className="text-green-600">+{formatCurrency(offer.monthly_rent - offer.property.price)}</span>
                      ) : offer.monthly_rent < offer.property.price ? (
                        <span className="text-red-600">-{formatCurrency(offer.property.price - offer.monthly_rent)}</span>
                      ) : (
                        'Asking price'
                      )}
                    </div>
                  )}
                </div>
              ))}
              highlight={hasVariation('monthly_rent')}
            />
            <ComparisonRow
              label="Move-in Date"
              values={offers.map(offer => formatDate(offer.move_in_date))}
              highlight={hasVariation('move_in_date')}
            />
            <ComparisonRow
              label="Term"
              values={offers.map(offer => 
                offer.term_months ? `${offer.term_months} months` : 'Not specified'
              )}
              highlight={hasVariation('term_months')}
            />
            <ComparisonRow
              label="Occupants"
              values={offers.map(offer => 
                offer.occupants?.toString() || 'Not specified'
              )}
              highlight={hasVariation('occupants')}
            />
            <ComparisonRow
              label="Pets"
              values={offers.map(offer => 
                offer.pets === null ? 'Not specified' : offer.pets ? 'Yes' : 'No'
              )}
              highlight={hasVariation('pets')}
            />
          </div>

          <Separator />

          {/* Status and Notes */}
          <div className="space-y-1">
            <h3 className="font-semibold text-base mb-3">Additional Information</h3>
            <ComparisonRow
              label="Status"
              values={offers.map(offer => getStatusBadge(offer.status))}
              highlight={hasVariation('status')}
            />
            <ComparisonRow
              label="Notes"
              values={offers.map(offer => (
                <div className="text-xs max-w-48 break-words">
                  {offer.notes || 'No notes'}
                </div>
              ))}
            />
          </div>

          <Separator />

          {/* Renter Information */}
          <div className="space-y-1">
            <h3 className="font-semibold text-base mb-3">Renter Information</h3>
            <ComparisonRow
              label="Name"
              values={offers.map(offer => offer.renter?.name || 'Not available')}
            />
            <ComparisonRow
              label="Email"
              values={offers.map(offer => offer.renter?.email || 'Not available')}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}