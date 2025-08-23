import React from 'react'
import { format } from 'date-fns'
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { OfferActions } from './OfferActions'
import type { OfferRow, OfferStatus } from '@/types/offers'

interface OffersTableProps {
  offers: OfferRow[]
  selectedOffers: string[]
  onOfferSelect: (offerId: string, selected: boolean) => void
  onStatusChange: (offerId: string, newStatus: OfferStatus) => void
  onRequestDocs: (offerId: string) => void
  loading?: boolean
  updatingOffers?: string[]
}

export const OffersTable: React.FC<OffersTableProps> = ({
  offers,
  selectedOffers,
  onOfferSelect,
  onStatusChange,
  onRequestDocs,
  loading = false,
  updatingOffers = []
}) => {
  const getStatusBadge = (status: OfferStatus) => {
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
        variant={variants[status]} 
        className={colors[status]}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Not specified'
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
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

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Renter</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Monthly Rent</TableHead>
              <TableHead>Move-in Date</TableHead>
              <TableHead>Term</TableHead>
              <TableHead>Occupants</TableHead>
              <TableHead>Pets</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (offers.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Renter</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Monthly Rent</TableHead>
              <TableHead>Move-in Date</TableHead>
              <TableHead>Term</TableHead>
              <TableHead>Occupants</TableHead>
              <TableHead>Pets</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <p className="text-muted-foreground">No offers found</p>
                  <p className="text-sm text-muted-foreground">
                    Offers will appear here when renters submit applications for your properties.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={offers.length > 0 && selectedOffers.length === offers.length}
                onCheckedChange={(checked) => {
                  offers.forEach(offer => onOfferSelect(offer.id, !!checked))
                }}
                aria-label="Select all offers"
              />
            </TableHead>
            <TableHead>Renter</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Monthly Rent</TableHead>
            <TableHead>Move-in Date</TableHead>
            <TableHead>Term</TableHead>
            <TableHead>Occupants</TableHead>
            <TableHead>Pets</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-16">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers.map((offer) => (
            <TableRow key={offer.id}>
              <TableCell>
                <Checkbox
                  checked={selectedOffers.includes(offer.id)}
                  onCheckedChange={(checked) => onOfferSelect(offer.id, !!checked)}
                  aria-label={`Select offer from ${offer.renter?.name || offer.renter_id}`}
                />
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {offer.renter?.name || 'Renter'}
                </div>
                {offer.renter?.email && (
                  <div className="text-sm text-muted-foreground">
                    {offer.renter.email}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {offer.property?.title || 'Property'}
                </div>
                {offer.property?.location && (
                  <div className="text-sm text-muted-foreground">
                    {offer.property.location}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {formatCurrency(offer.monthly_rent)}
                </div>
                {offer.property?.price && offer.monthly_rent && (
                  <div className="text-sm text-muted-foreground">
                    {offer.monthly_rent > offer.property.price ? (
                      <span className="text-green-600">+{formatCurrency(offer.monthly_rent - offer.property.price)}</span>
                    ) : offer.monthly_rent < offer.property.price ? (
                      <span className="text-red-600">-{formatCurrency(offer.property.price - offer.monthly_rent)}</span>
                    ) : (
                      'Asking price'
                    )}
                  </div>
                )}
              </TableCell>
              <TableCell>{formatDate(offer.move_in_date)}</TableCell>
              <TableCell>
                {offer.term_months ? `${offer.term_months} months` : 'Not specified'}
              </TableCell>
              <TableCell>
                {offer.occupants || 'Not specified'}
              </TableCell>
              <TableCell>
                {offer.pets === null ? 'Not specified' : offer.pets ? 'Yes' : 'No'}
              </TableCell>
              <TableCell>{getStatusBadge(offer.status)}</TableCell>
              <TableCell>
                <OfferActions
                  offerId={offer.id}
                  currentStatus={offer.status}
                  onStatusChange={onStatusChange}
                  onRequestDocs={onRequestDocs}
                  loading={updatingOffers.includes(offer.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}