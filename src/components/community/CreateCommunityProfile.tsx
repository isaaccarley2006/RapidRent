import React, { useState, useEffect } from 'react'
import { useUser } from '@/lib/auth/useUser'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, X, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface CreateCommunityProfileProps {
  onSuccess: () => void
  onCancel: () => void
}

const POPULAR_AREAS = [
  'Shoreditch', 'Hackney', 'Bethnal Green', 'Dalston', 'Hoxton',
  'Clapham', 'Battersea', 'Wandsworth', 'Brixton', 'Peckham',
  'Camden', 'Kings Cross', 'Bloomsbury', 'Islington', 'Angel',
  'Canary Wharf', 'Bermondsey', 'London Bridge', 'Borough', 'Southwark'
]

const COMMUNITY_GROUPS = [
  'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
  'Dutch', 'Polish', 'Shoreditch', 'Global'
]

export const CreateCommunityProfile: React.FC<CreateCommunityProfileProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { user } = useUser()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    headline: '',
    bio: '',
    budget_per_person: '',
    preferred_areas: [] as string[],
    move_in_date: '',
    duration_months: '',
    gender_preference: '',
    occupation: '',
    work_pattern: '',
    has_pets: false,
    is_smoker: false,
    community_groups: [] as string[],
  })

  // Fetch user profile data to pre-populate form
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setUserProfile(data)
        // Auto-populate form with existing data
        setFormData(prev => ({
          ...prev,
          occupation: data.job_title || prev.occupation,
          bio: data.additional_notes || prev.bio,
          budget_per_person: data.annual_income ? Math.round(data.annual_income / 12 * 0.3).toString() : prev.budget_per_person,
          has_pets: data.has_pets || prev.has_pets,
          is_smoker: data.is_smoker || prev.is_smoker,
          // Add nationality to community groups if available
          community_groups: data.nationality ? [data.nationality] : prev.community_groups,
        }))
      }
    }

    fetchUserProfile()
  }, [user?.id])

  const addArea = (area: string) => {
    if (!formData.preferred_areas.includes(area)) {
      setFormData(prev => ({
        ...prev,
        preferred_areas: [...prev.preferred_areas, area]
      }))
    }
  }

  const removeArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_areas: prev.preferred_areas.filter(a => a !== area)
    }))
  }

  const toggleCommunityGroup = (group: string) => {
    setFormData(prev => ({
      ...prev,
      community_groups: prev.community_groups.includes(group)
        ? prev.community_groups.filter(g => g !== group)
        : [...prev.community_groups, group]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    setLoading(true)
    try {
      const profileData = {
        user_id: user.id,
        headline: formData.headline,
        bio: formData.bio || null,
        budget_per_person: formData.budget_per_person ? parseFloat(formData.budget_per_person) : null,
        preferred_areas: formData.preferred_areas.length > 0 ? formData.preferred_areas : null,
        move_in_date: formData.move_in_date || null,
        duration_months: formData.duration_months ? parseInt(formData.duration_months) : null,
        gender_preference: formData.gender_preference || null,
        occupation: formData.occupation || null,
        work_pattern: formData.work_pattern || null,
        has_pets: formData.has_pets,
        is_smoker: formData.is_smoker,
        community_groups: formData.community_groups,
        status: 'active'
      }

      const { error } = await supabase
        .from('community_profile_cards')
        .insert(profileData)

      if (error) throw error

      toast({
        title: 'Profile created successfully!',
        description: 'Your community profile is now live and visible to other tenants.',
      })

      onSuccess()
    } catch (error: any) {
      console.error('Error creating profile:', error)
      toast({
        title: 'Error creating profile',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onCancel}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Communities
          </Button>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create Community Profile
          </h1>
          <p className="text-muted-foreground">
            Share your details to connect with potential housemates in your community.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Headline */}
              <div>
                <Label htmlFor="headline" className="text-sm font-medium">
                  Profile Headline *
                </Label>
                <Input
                  id="headline"
                  placeholder="e.g. Spanish Marketing Manager seeking Shoreditch flatmate"
                  value={formData.headline}
                  onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Include your nationality, profession, and area preference
                </p>
              </div>

              {/* Bio */}
              <div>
                <Label htmlFor="bio" className="text-sm font-medium">
                  Bio (280 characters max)
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Tell potential housemates about yourself, your lifestyle, and what you're looking for..."
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  maxLength={280}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.bio.length}/280 characters
                </p>
              </div>

              {/* Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget" className="text-sm font-medium">
                    Budget per person/month (£)
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="800"
                    value={formData.budget_per_person}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget_per_person: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="duration" className="text-sm font-medium">
                    Duration (months)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="12"
                    value={formData.duration_months}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_months: e.target.value }))}
                  />
                </div>
              </div>

              {/* Move-in Date */}
              <div>
                <Label htmlFor="move_in_date" className="text-sm font-medium">
                  Preferred Move-in Date
                </Label>
                <Input
                  id="move_in_date"
                  type="date"
                  value={formData.move_in_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, move_in_date: e.target.value }))}
                />
              </div>

              {/* Preferred Areas */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Preferred Areas
                </Label>
                
                {formData.preferred_areas.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.preferred_areas.map((area) => (
                      <Badge 
                        key={area} 
                        variant="secondary" 
                        className="gap-1 cursor-pointer hover:bg-secondary/80"
                        onClick={() => removeArea(area)}
                      >
                        {area}
                        <X className="h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {POPULAR_AREAS.filter(area => !formData.preferred_areas.includes(area))
                    .slice(0, 9).map((area) => (
                    <Button
                      key={area}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArea(area)}
                      className="justify-start text-xs h-8"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {area}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Work Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="occupation" className="text-sm font-medium">
                    Occupation
                  </Label>
                  <Input
                    id="occupation"
                    placeholder="e.g. Software Engineer"
                    value={formData.occupation}
                    onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="work_pattern" className="text-sm font-medium">
                    Work Pattern
                  </Label>
                  <Select 
                    value={formData.work_pattern} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, work_pattern: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select work pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="office">Office-based</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="shift">Shift work</SelectItem>
                      <SelectItem value="travel">Frequent travel</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Gender Preference */}
              <div>
                <Label className="text-sm font-medium">Gender Preference</Label>
                <Select 
                  value={formData.gender_preference} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, gender_preference: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mixed">Mixed</SelectItem>
                    <SelectItem value="female">Female only</SelectItem>
                    <SelectItem value="male">Male only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Community Groups */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Community Groups (select all that apply)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {COMMUNITY_GROUPS.map((group) => (
                    <Button
                      key={group}
                      type="button"
                      variant={formData.community_groups.includes(group) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCommunityGroup(group)}
                      className="text-xs"
                    >
                      {group}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your profile will appear in selected community groups
                </p>
              </div>

              {/* Lifestyle */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Lifestyle</Label>
                
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={formData.has_pets}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_pets: checked }))}
                  />
                  <Label className="text-sm">I have pets</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch 
                    checked={formData.is_smoker}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_smoker: checked }))}
                  />
                  <Label className="text-sm">I am a smoker</Label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-6">
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading || !formData.headline.trim()}
                  className="flex-1"
                >
                  {loading ? 'Creating...' : 'Create Profile'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}