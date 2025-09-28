import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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

const COMMUNITY_GROUPS = [
  { id: 'spanish', label: 'Spanish', flag: '🇪🇸' },
  { id: 'french', label: 'French', flag: '🇫🇷' },
  { id: 'german', label: 'German', flag: '🇩🇪' },
  { id: 'british', label: 'British', flag: '🇬🇧' },
  { id: 'italian', label: 'Italian', flag: '🇮🇹' },
  { id: 'portuguese', label: 'Portuguese', flag: '🇵🇹' },
  { id: 'dutch', label: 'Dutch', flag: '🇳🇱' },
  { id: 'polish', label: 'Polish', flag: '🇵🇱' },
]

const getNationalityFromGroups = (communityGroups: string[] = []) => {
  if (communityGroups.length === 0) return { label: 'International', flag: '🌍' }
  
  const group = COMMUNITY_GROUPS.find(g => communityGroups.includes(g.id))
  return group ? { label: group.label, flag: group.flag } : { label: 'International', flag: '🌍' }
}

export const CommunityProfileCard: React.FC<CommunityProfileCardProps> = ({ 
  profile, 
  currentUserId 
}) => {
  const navigate = useNavigate()
  const isOwnProfile = currentUserId === profile.user_id
  const nationality = getNationalityFromGroups(profile.community_groups)

  const handleConnect = () => {
    if (isOwnProfile) return
    navigate(`/tenant/communities/${profile.id}`)
  }

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 border-border bg-card overflow-hidden h-full">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Header with nationality and verification */}
          <div className="p-[5px] pb-2">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {nationality.flag}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {nationality.label}
                  </span>
                  <Badge variant="secondary" className="w-fit text-xs gap-1">
                    <Shield className="h-3 w-3" />
                    Verified ID
                  </Badge>
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
          <div className="px-[5px] pb-2 space-y-2 flex-1">
            {/* Preferred Areas */}
            {profile.preferred_areas && profile.preferred_areas.length > 0 && (
              <div className="mb-2">
                <div className="flex flex-wrap gap-1">
                  {profile.preferred_areas.map((area, index) => (
                    <Badge key={index} className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200 text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
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
          <div className="px-[5px] pb-2">
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


          {/* Connect Button */}
          <div className="p-[5px] mt-auto">
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
    </>
  )
}