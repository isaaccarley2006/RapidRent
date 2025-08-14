import React from 'react'
import { MoreHorizontal, Star, FileText, Check, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import type { OfferStatus } from '@/types/offers'

interface OfferActionsProps {
  offerId: string
  currentStatus: OfferStatus
  onStatusChange: (offerId: string, newStatus: OfferStatus) => void
  onRequestDocs: (offerId: string) => void
  loading?: boolean
}

export const OfferActions: React.FC<OfferActionsProps> = ({
  offerId,
  currentStatus,
  onStatusChange,
  onRequestDocs,
  loading = false
}) => {
  const handleAction = (action: string) => {
    switch (action) {
      case 'shortlist':
        onStatusChange(offerId, 'shortlisted')
        break
      case 'accept':
        onStatusChange(offerId, 'accepted')
        break
      case 'reject':
        onStatusChange(offerId, 'rejected')
        break
      case 'request-docs':
        onRequestDocs(offerId)
        break
    }
  }

  const canShortlist = currentStatus === 'submitted'
  const canAccept = ['submitted', 'shortlisted'].includes(currentStatus)
  const canReject = currentStatus !== 'rejected'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={loading}>
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open actions menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {canShortlist && (
          <DropdownMenuItem onClick={() => handleAction('shortlist')}>
            <Star className="mr-2 h-4 w-4" />
            Shortlist
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => handleAction('request-docs')}>
          <FileText className="mr-2 h-4 w-4" />
          Request Documents
        </DropdownMenuItem>
        {canAccept && (
          <DropdownMenuItem onClick={() => handleAction('accept')}>
            <Check className="mr-2 h-4 w-4" />
            Accept Offer
          </DropdownMenuItem>
        )}
        {canReject && (
          <DropdownMenuItem onClick={() => handleAction('reject')}>
            <X className="mr-2 h-4 w-4" />
            Reject Offer
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}