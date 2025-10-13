import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  X,
  MapPin,
  Calendar,
  Users,
  Briefcase,
  Shield
} from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

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

interface CommunityFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

const POPULAR_AREAS = [
  'Shoreditch', 'Hackney', 'Bethnal Green', 'Dalston', 'Hoxton',
  'Clapham', 'Battersea', 'Wandsworth', 'Brixton', 'Peckham',
  'Camden', 'Kings Cross', 'Bloomsbury', 'Islington', 'Angel',
  'Canary Wharf', 'Bermondsey', 'London Bridge', 'Borough', 'Southwark',
  'Kensington', 'Chelsea', 'South Kensington', 'Notting Hill', 'Paddington'
]

export const CommunityFilters: React.FC<CommunityFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const updateFilter = (key: keyof Filters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const addArea = (area: string) => {
    if (!filters.areas.includes(area)) {
      updateFilter('areas', [...filters.areas, area])
    }
  }

  const removeArea = (area: string) => {
    updateFilter('areas', filters.areas.filter(a => a !== area))
  }

  const clearFilters = () => {
    onFiltersChange({
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
  }

  const hasActiveFilters = filters.search || 
    filters.budgetMin > 0 || 
    filters.budgetMax < 2000 ||
    filters.areas.length > 0 ||
    filters.moveInFrom ||
    filters.moveInTo ||
    filters.genderPreference ||
    filters.occupation ||
    filters.verifiedOnly ||
    filters.hasPets !== null ||
    filters.isSmoker !== null

  return (
    <Card className="border-border">
      <CardContent className="p-4">
        {/* Search Bar */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by headline or bio..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                    !
                  </Badge>
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <Switch 
              checked={filters.verifiedOnly}
              onCheckedChange={(checked) => updateFilter('verifiedOnly', checked)}
            />
            <Label className="text-sm">Verified ID only</Label>
          </div>
        </div>

        {/* Expanded Filters */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="space-y-6">
            {/* Budget Range */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Budget Range (per person/month)
              </Label>
              <div className="px-3">
                <Slider
                  value={[filters.budgetMin, filters.budgetMax]}
                  onValueChange={([min, max]) => {
                    updateFilter('budgetMin', min)
                    updateFilter('budgetMax', max)
                  }}
                  max={2000}
                  min={0}
                  step={50}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>£{filters.budgetMin}</span>
                  <span>£{filters.budgetMax}+</span>
                </div>
              </div>
            </div>

            {/* Preferred Areas */}
            <div>
              <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Preferred Areas
              </Label>
              
              {filters.areas.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {filters.areas.map((area) => (
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

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {POPULAR_AREAS.filter(area => !filters.areas.includes(area))
                  .slice(0, 12).map((area) => (
                  <Button
                    key={area}
                    variant="outline"
                    size="sm"
                    onClick={() => addArea(area)}
                    className="justify-start text-xs h-8"
                  >
                    {area}
                  </Button>
                ))}
              </div>
            </div>

            {/* Move-in Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Move-in From
                </Label>
                <Input
                  type="date"
                  value={filters.moveInFrom}
                  onChange={(e) => updateFilter('moveInFrom', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Move-in To
                </Label>
                <Input
                  type="date"
                  value={filters.moveInTo}
                  onChange={(e) => updateFilter('moveInTo', e.target.value)}
                />
              </div>
            </div>

            {/* Gender Preference */}
            <div>
              <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Users className="h-4 w-4" />
                Gender Preference
              </Label>
              <Select 
                value={filters.genderPreference} 
                onValueChange={(value) => updateFilter('genderPreference', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                  <SelectItem value="female">Female only</SelectItem>
                  <SelectItem value="male">Male only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Occupation */}
            <div>
              <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Occupation
              </Label>
              <Input
                placeholder="e.g. Software Engineer, Student, Chef..."
                value={filters.occupation}
                onChange={(e) => updateFilter('occupation', e.target.value)}
              />
            </div>

            {/* Lifestyle Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-3 block">Pets</Label>
                <Select 
                  value={filters.hasPets === null ? '' : filters.hasPets.toString()} 
                  onValueChange={(value) => updateFilter('hasPets', value === '' ? null : value === 'true')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="true">Has pets</SelectItem>
                    <SelectItem value="false">No pets</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Smoking</Label>
                <Select 
                  value={filters.isSmoker === null ? '' : filters.isSmoker.toString()} 
                  onValueChange={(value) => updateFilter('isSmoker', value === '' ? null : value === 'true')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="true">Smoker</SelectItem>
                    <SelectItem value="false">Non-smoker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex justify-end pt-2">
                <Button 
                  variant="ghost" 
                  onClick={clearFilters}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear all filters
                </Button>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}