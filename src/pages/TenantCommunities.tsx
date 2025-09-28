import React, { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useUser } from '@/lib/auth/useUser'
import { CommunityProfileCard } from '@/components/community/CommunityProfileCard'
import { CommunityFilters } from '@/components/community/CommunityFilters'
import { CreateCommunityProfile } from '@/components/community/CreateCommunityProfile'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus } from 'lucide-react'
import { SEOHead } from '@/components/common/SEOHead'

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

interface Filters {
  search: string
  budgetMin: number
  budgetMax: number
  areas: string[]
  moveInFrom: string
  moveInTo: string
  genderPreference: string
  occupation: string
  verifiedOnly: boolean
  hasPets: boolean | null
  isSmoker: boolean | null
}

const COMMUNITY_GROUPS = [
  { id: 'all', label: 'All Communities', flag: '🌍' },
  { id: 'Spanish', label: 'Spanish', flag: '🇪🇸' },
  { id: 'French', label: 'French', flag: '🇫🇷' },
  { id: 'German', label: 'German', flag: '🇩🇪' },
  { id: 'Shoreditch', label: 'Shoreditch', flag: '🏙️' },
]

const TenantCommunities: React.FC = () => {
  const { user } = useUser()
  const [profiles, setProfiles] = useState<CommunityProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [activeGroup, setActiveGroup] = useState('all')
  const [filters, setFilters] = useState<Filters>({
    search: '',
    budgetMin: 0,
    budgetMax: 2000,
    areas: [],
    moveInFrom: '',
    moveInTo: '',
    genderPreference: '',
    occupation: '',
    verifiedOnly: false,
    hasPets: null,
    isSmoker: null,
  })

  const fetchProfiles = async () => {
    try {
      setLoading(true)
      
      // Fetch community profiles with user profile data for nationality and verification
      const { data, error } = await supabase
        .from('community_profile_cards')
        .select(`
          *,
          profiles(nationality, identity_verified)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedProfiles = data?.map((profile: any) => ({
        ...profile,
        nationality: profile.profiles?.nationality || undefined,
        identity_verified: profile.profiles?.identity_verified || false,
      })) || []

      setProfiles(formattedProfiles)
    } catch (error) {
      console.error('Error fetching community profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  const filteredProfiles = profiles.filter(profile => {
    // Group filter
    if (activeGroup !== 'all' && !profile.community_groups.includes(activeGroup)) {
      return false
    }

    // Search filter
    if (filters.search && !profile.headline.toLowerCase().includes(filters.search.toLowerCase()) && 
        !(profile.bio?.toLowerCase().includes(filters.search.toLowerCase()))) {
      return false
    }

    // Budget filter
    if (profile.budget_per_person) {
      if (profile.budget_per_person < filters.budgetMin || profile.budget_per_person > filters.budgetMax) {
        return false
      }
    }

    // Verified only filter
    if (filters.verifiedOnly && !profile.identity_verified) {
      return false
    }

    // Gender preference filter
    if (filters.genderPreference && profile.gender_preference !== filters.genderPreference) {
      return false
    }

    // Occupation filter
    if (filters.occupation && profile.occupation && 
        !profile.occupation.toLowerCase().includes(filters.occupation.toLowerCase())) {
      return false
    }

    // Pets filter
    if (filters.hasPets !== null && profile.has_pets !== filters.hasPets) {
      return false
    }

    // Smoker filter
    if (filters.isSmoker !== null && profile.is_smoker !== filters.isSmoker) {
      return false
    }

    return true
  })

  if (showCreateForm) {
    return (
      <CreateCommunityProfile 
        onSuccess={() => {
          setShowCreateForm(false)
          fetchProfiles()
        }}
        onCancel={() => setShowCreateForm(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Tenant Communities - Find Housemates | RapidRent"
        description="Connect with verified tenants from your community. Find trusted housemates through nationality-based groups and verified profiles."
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Tenant Communities
              </h1>
              <p className="text-muted-foreground">
                Find trusted housemates and connect through verified profiles.
              </p>
            </div>
            <Button onClick={() => setShowCreateForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Profile
            </Button>
          </div>
        </div>

        {/* Community Group Tabs */}
        <Tabs value={activeGroup} onValueChange={setActiveGroup} className="mb-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:inline-flex">
            {COMMUNITY_GROUPS.map((group) => (
              <TabsTrigger key={group.id} value={group.id} className="flex items-center gap-2">
                <span>{group.flag}</span>
                <span className="hidden sm:inline">{group.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Filters */}
        <CommunityFilters filters={filters} onFiltersChange={setFilters} />

        {/* Results */}
        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  {filteredProfiles.length} {filteredProfiles.length === 1 ? 'profile' : 'profiles'} found
                </p>
              </div>
              
              {filteredProfiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProfiles.map((profile) => (
                    <CommunityProfileCard 
                      key={profile.id} 
                      profile={profile}
                      currentUserId={user?.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg mb-4">
                    No profiles match your current filters
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search criteria or browse a different community
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Message */}
        <div className="mt-12 p-4 bg-muted/50 rounded-lg border">
          <p className="text-sm text-muted-foreground text-center">
            Your ID is verified privately by RapidRent. Only nationality + badge are displayed. 
            Credit and affordability checks stay hidden.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TenantCommunities