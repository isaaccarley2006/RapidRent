import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, Clock, Briefcase, Users, PawPrint, Cigarette, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase } from '@/integrations/supabase/client'
import { format } from 'date-fns'
import { SEOHead } from '@/components/common/SEOHead'
import { toast } from '@/hooks/use-toast'

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

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'active': return 'default'
    case 'paused': return 'secondary'
    case 'filled': return 'outline'
    case 'expired': return 'destructive'
    default: return 'secondary'
  }
}

const getNationalityFromGroups = (communityGroups: string[]) => {
  if (!communityGroups || communityGroups.length === 0) return { label: 'International', flag: '🌍' }
  
  const group = COMMUNITY_GROUPS.find(g => communityGroups.includes(g.id))
  return group ? { label: group.label, flag: group.flag } : { label: 'International', flag: '🌍' }
}

export default function CommunityProfileDetail() {
  const { profileId } = useParams<{ profileId: string }>()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<CommunityProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profileId) {
      navigate('/tenant/communities')
      return
    }

    fetchProfile()
  }, [profileId])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('community_profile_cards')
        .select('*')
        .eq('id', profileId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        toast({
          title: "Error",
          description: "Could not load profile details",
          variant: "destructive"
        })
        navigate('/tenant/communities')
        return
      }

      setProfile(data)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error", 
        description: "Could not load profile details",
        variant: "destructive"
      })
      navigate('/tenant/communities')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead 
          title="Community Profile - Loading"
          description="Loading community member profile"
        />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4 w-48"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  const nationality = getNationalityFromGroups(profile.community_groups)

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={`${profile.headline} - Community Profile`}
        description={profile.bio || `Community member looking for accommodation in ${profile.preferred_areas?.join(', ') || 'various areas'}`}
      />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/tenant/communities')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Community
        </Button>

        <Card className="max-w-4xl">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{nationality.flag}</span>
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-1">
                    {profile.headline}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {nationality.label}
                    </span>
                    <Badge variant="secondary" className="gap-1">
                      <Shield className="h-3 w-3" />
                      Identity Verified
                    </Badge>
                  </div>
                </div>
              </div>
              <Badge variant={getStatusBadgeVariant(profile.status)} className="capitalize">
                {profile.status}
              </Badge>
            </div>

            {/* Budget */}
            {profile.budget_per_person && (
              <div className="mb-6">
                <p className="text-3xl font-bold text-primary">
                  £{profile.budget_per_person}/month per person
                </p>
              </div>
            )}

            {/* Bio */}
            {profile.bio && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-3">About</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Preferred Areas */}
            {profile.preferred_areas && profile.preferred_areas.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-3">Preferred Areas</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.preferred_areas.map((area, index) => (
                    <Badge key={index} className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200">
                      <MapPin className="h-3 w-3 mr-1" />
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Timeline */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">Timeline</h2>
                <div className="space-y-3">
                  {profile.move_in_date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Move-in: {format(new Date(profile.move_in_date), 'MMMM yyyy')}</span>
                    </div>
                  )}
                  {profile.duration_months && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Duration: {profile.duration_months} months</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Work */}
              {profile.occupation && (
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-3">Work</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>
                      {profile.occupation}
                      {profile.work_pattern && ` • ${profile.work_pattern}`}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Lifestyle */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-3">Lifestyle</h2>
              <div className="flex flex-wrap gap-4">
                {profile.gender_preference && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="capitalize">{profile.gender_preference} preferred</span>
                  </div>
                )}
                {profile.has_pets && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <PawPrint className="h-4 w-4" />
                    <span>Has pets</span>
                  </div>
                )}
                {profile.is_smoker && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Cigarette className="h-4 w-4" />
                    <span>Smoker</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Section */}
            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                Interested in connecting? Send a message to start the conversation.
              </p>
              <Button className="w-full">
                Send Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}