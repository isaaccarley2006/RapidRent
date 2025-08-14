import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { LandlordListing } from '@/types/offers'

interface ListingFilterProps {
  listings: LandlordListing[]
  selectedListingId: string | null
  onListingChange: (listingId: string | null) => void
  loading?: boolean
}

export const ListingFilter: React.FC<ListingFilterProps> = ({
  listings,
  selectedListingId,
  onListingChange,
  loading = false
}) => {
  return (
    <div className="w-64">
      <Select
        value={selectedListingId || 'all'}
        onValueChange={(value) => onListingChange(value === 'all' ? null : value)}
        disabled={loading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by property" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Properties</SelectItem>
          {listings.map((listing) => (
            <SelectItem key={listing.id} value={listing.id}>
              {listing.title}
              {listing.location && ` • ${listing.location}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}