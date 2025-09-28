import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Briefcase, 
  Users, 
  PawPrint, 
  Cigarette,
  Shield,
  MessageCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { ConnectDialog } from './ConnectDialog'

interface CommunityProfile {
  id: string
  user_id: string
  headline: string
  bio: string | null
  budget_per_person: number | null
  preferred_areas: string[] | null
  move_in_date: string | null
  duration_months: number | null
  gender_preference: string | null
  occupation: string | null
  work_pattern: string | null
  has_pets: boolean
  is_smoker: boolean
  status: string
  community_groups: string[]
  created_at: string
  nationality?: string
  identity_verified?: boolean
}

interface CommunityProfileCardProps {
  profile: CommunityProfile
  currentUserId?: string
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'active': return 'default'
    case 'paused': return 'secondary'
    case 'filled': return 'outline'
    case 'expired': return 'destructive'
    default: return 'secondary'
  }
}

const getNationalityFlag = (nationality: string | undefined) => {
  const flags: { [key: string]: string } = {
    'Spanish': '🇪🇸',
    'French': '🇫🇷', 
    'German': '🇩🇪',
    'British': '🇬🇧',
    'Italian': '🇮🇹',
    'Portuguese': '🇵🇹',
    'Dutch': '🇳🇱',
    'Polish': '🇵🇱',
  }
  return flags[nationality || ''] || '🌍'
}

export const CommunityProfileCard: React.FC<CommunityProfileCardProps> = ({ 
  profile, 
  currentUserId 
}) => {
  const [showConnectDialog, setShowConnectDialog] = useState(false)
  const isOwnProfile = currentUserId === profile.user_id

  const handleConnect = () => {
    if (isOwnProfile) return
    setShowConnectDialog(true)
  }

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 border-border bg-card overflow-hidden">
        <CardContent className="p-0">
          {/* Header with nationality and verification */}
          <div className="p-4 pb-3">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {getNationalityFlag(profile.nationality)}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {profile.nationality || 'Global'}
                  </span>
                  {profile.identity_verified && (
                    <Badge variant="secondary" className="w-fit text-xs gap-1">
                      <Shield className="h-3 w-3" />
                      Verified ID
                    </Badge>
                  )}
                </div>
              </div>
              <Badge variant={getStatusBadgeVariant(profile.status)} className="capitalize">
                {profile.status}
              </Badge>
            </div>

            {/* Headline */}
            <h3 className="font-semibold text-foreground leading-tight mb-2 line-clamp-2">
              {profile.headline}
            </h3>

            {/* Budget */}
            {profile.budget_per_person && (
              <p className="text-lg font-bold text-primary mb-2">
                £{profile.budget_per_person}/month
              </p>
            )}
          </div>

          {/* Key Details */}
          <div className="px-4 pb-3 space-y-2">
            {/* Preferred Areas */}
            {profile.preferred_areas && profile.preferred_areas.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  {profile.preferred_areas.slice(0, 2).join(', ')}
                  {profile.preferred_areas.length > 2 && ` +${profile.preferred_areas.length - 2} more`}
                </span>
              </div>
            )}

            {/* Move-in date and duration */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {profile.move_in_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(profile.move_in_date), 'MMM yyyy')}</span>
                </div>
              )}
              {profile.duration_months && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{profile.duration_months}m</span>
                </div>
              )}
            </div>

            {/* Occupation and work pattern */}
            {profile.occupation && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  {profile.occupation}
                  {profile.work_pattern && ` • ${profile.work_pattern}`}
                </span>
              </div>
            )}
          </div>

          {/* Lifestyle Icons */}
          <div className="px-4 pb-3">
            <div className="flex items-center gap-3">
              {profile.gender_preference && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span className="capitalize">{profile.gender_preference}</span>
                </div>
              )}
              {profile.has_pets && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <PawPrint className="h-3 w-3" />
                  <span>Pets</span>
                </div>
              )}
              {profile.is_smoker && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Cigarette className="h-3 w-3" />
                  <span>Smoker</span>
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="px-4 pb-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Connect Button */}
          <div className="p-4 pt-0">
            <Button 
              onClick={handleConnect}
              disabled={isOwnProfile}
              className="w-full gap-2"
              variant={isOwnProfile ? "outline" : "default"}
            >
              <MessageCircle className="h-4 w-4" />
              {isOwnProfile ? 'Your Profile' : 'Connect'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConnectDialog
        isOpen={showConnectDialog}
        onClose={() => setShowConnectDialog(false)}
        targetProfile={profile}
      />
    </>
  )
}