import React, { useState } from 'react'
import { Search, Filter, Users, CheckCircle, Clock, XCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TenantSearchFiltersProps {
  onFiltersChange?: (filters: {
    search: string
    verificationStatus: string
    location: string
  }) => void
}

export const TenantSearchFilters: React.FC<TenantSearchFiltersProps> = ({
  onFiltersChange
}) => {
  const [search, setSearch] = useState('')
  const [verificationStatus, setVerificationStatus] = useState('all')
  const [location, setLocation] = useState('all')

  const handleFiltersChange = () => {
    onFiltersChange?.({ search, verificationStatus, location })
  }

  React.useEffect(() => {
    handleFiltersChange()
  }, [search, verificationStatus, location])

  const stats = [
    { icon: Users, label: 'Total Tenants', value: '24', color: 'bg-primary' },
    { icon: CheckCircle, label: 'Verified', value: '18', color: 'bg-success' },
    { icon: Clock, label: 'Pending', value: '4', color: 'bg-warning' },
    { icon: XCircle, label: 'Incomplete', value: '2', color: 'bg-destructive' }
  ]

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.color}/10`}>
                  <stat.icon className={`h-4 w-4 text-${stat.color.replace('bg-', '')}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or property..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={verificationStatus} onValueChange={setVerificationStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Verification Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="incomplete">Incomplete</SelectItem>
              </SelectContent>
            </Select>

            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="london">London</SelectItem>
                <SelectItem value="manchester">Manchester</SelectItem>
                <SelectItem value="birmingham">Birmingham</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}