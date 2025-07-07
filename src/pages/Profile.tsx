
import React, { useState, useEffect } from 'react'
import { AppLayout } from '@/components/layouts/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { 
  User, 
  Shield, 
  FileText, 
  Users, 
  CreditCard, 
  Building, 
  Check, 
  X, 
  Plus,
  Upload,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Clock
} from 'lucide-react'

interface TenantProfile {
  // Basic Info
  full_name: string | null
  email: string | null
  phone: string | null
  date_of_birth: string | null
  national_insurance_number: string | null
  
  // Address Info
  current_address: string | null
  previous_address: string | null
  time_at_current_address: string | null
  
  // Employment Info
  employment_status: string | null
  employer_name: string | null
  employer_address: string | null
  job_title: string | null
  employment_start_date: string | null
  annual_income: number | null
  
  // Financial Info
  credit_score: number | null
  bank_name: string | null
  account_holder_name: string | null
  sort_code: string | null
  
  // Personal Info
  has_pets: boolean | null
  pet_details: string | null
  is_smoker: boolean | null
  tenant_references: string | null
  additional_notes: string | null
  
  // Emergency Contact
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  emergency_contact_relationship: string | null
  
  // Verification Status
  identity_verified: boolean
  employment_verified: boolean
  income_verified: boolean
  credit_verified: boolean
  references_verified: boolean
  bank_verified: boolean
  profile_completion_percentage: number
}

interface TenantReference {
  id: string
  reference_type: string
  contact_name: string
  contact_email: string | null
  contact_phone: string | null
  company_name: string | null
  relationship: string | null
  reference_period: string | null
  notes: string | null
  verification_status: string
  verified_at: string | null
}

const Profile: React.FC = () => {
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<TenantProfile | null>(null)
  const [references, setReferences] = useState<TenantReference[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')

  // Form state for profile
  const [formData, setFormData] = useState<Partial<TenantProfile>>({})

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchReferences()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setProfile(data)
        setFormData(data)
      } else {
        // Create initial profile
        const initialProfile = {
          id: user.id,
          email: user.email,
          user_type: 'tenant'
        }
        setFormData(initialProfile)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: "Error loading profile",
        description: "Please try refreshing the page.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchReferences = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('tenant_references')
        .select('*')
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReferences(data || [])
    } catch (error) {
      console.error('Error fetching references:', error)
    }
  }

  const calculateCompletion = (data: Partial<TenantProfile>) => {
    const fields = [
      'full_name', 'phone', 'date_of_birth', 'current_address',
      'employment_status', 'employer_name', 'job_title', 'annual_income',
      'bank_name', 'account_holder_name'
    ]
    
    const completed = fields.filter(field => {
      const value = data[field as keyof TenantProfile]
      return value !== null && value !== undefined && value !== ''
    }).length
    
    return Math.round((completed / fields.length) * 100)
  }

  const saveProfile = async () => {
    if (!user) return

    setSaving(true)
    try {
      const completionPercentage = calculateCompletion(formData)
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          ...formData,
          id: user.id,
          user_type: 'tenant',
          profile_completion_percentage: completionPercentage,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast({
        title: "Profile updated successfully",
        description: "Your tenant profile has been saved."
      })

      fetchProfile()
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: "Error saving profile",
        description: "Please try again.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const addReference = async (referenceData: { 
    reference_type: string, 
    contact_name: string,
    contact_email?: string,
    contact_phone?: string,
    company_name?: string,
    relationship?: string,
    reference_period?: string,
    notes?: string
  }) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('tenant_references')
        .insert({
          ...referenceData,
          tenant_id: user.id
        })

      if (error) throw error

      toast({
        title: "Reference added",
        description: "Your reference has been added successfully."
      })

      fetchReferences()
    } catch (error) {
      console.error('Error adding reference:', error)
      toast({
        title: "Error adding reference",
        description: "Please try again.",
        variant: "destructive"
      })
    }
  }

  const getVerificationColor = (verified: boolean) => {
    return verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
  }

  const getVerificationIcon = (verified: boolean) => {
    return verified ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-text-primary">Tenant Profile</h1>
          <p className="text-text-muted mt-2">
            Complete your verified tenant profile for faster applications
          </p>
        </div>

        {/* Profile Completion Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Profile Verification Status
            </CardTitle>
            <CardDescription>
              Complete and verify your profile to speed up rental applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Profile Completion</span>
                  <span className="text-sm text-text-muted">
                    {profile?.profile_completion_percentage || 0}%
                  </span>
                </div>
                <Progress value={profile?.profile_completion_percentage || 0} className="h-2" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { key: 'identity', label: 'Identity', verified: profile?.identity_verified },
                  { key: 'employment', label: 'Employment', verified: profile?.employment_verified },
                  { key: 'income', label: 'Income', verified: profile?.income_verified },
                  { key: 'credit', label: 'Credit Score', verified: profile?.credit_verified },
                  { key: 'references', label: 'References', verified: profile?.references_verified },
                  { key: 'bank', label: 'Bank Details', verified: profile?.bank_verified }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">{item.label}</span>
                    <Badge className={getVerificationColor(item.verified || false)}>
                      {getVerificationIcon(item.verified || false)}
                      {item.verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="references">References</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name || ''}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      placeholder="Enter your full legal name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={formData.email || user?.email || ''}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date_of_birth">Date of Birth *</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth || ''}
                      onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="national_insurance_number">National Insurance Number</Label>
                    <Input
                      id="national_insurance_number"
                      value={formData.national_insurance_number || ''}
                      onChange={(e) => setFormData({...formData, national_insurance_number: e.target.value})}
                      placeholder="XX 12 34 56 X"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="current_address">Current Address *</Label>
                      <Textarea
                        id="current_address"
                        value={formData.current_address || ''}
                        onChange={(e) => setFormData({...formData, current_address: e.target.value})}
                        placeholder="Enter your current full address"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time_at_current_address">Time at Current Address</Label>
                      <Select 
                        value={formData.time_at_current_address || ''} 
                        onValueChange={(value) => setFormData({...formData, time_at_current_address: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="less-than-6-months">Less than 6 months</SelectItem>
                          <SelectItem value="6-12-months">6-12 months</SelectItem>
                          <SelectItem value="1-2-years">1-2 years</SelectItem>
                          <SelectItem value="2-5-years">2-5 years</SelectItem>
                          <SelectItem value="more-than-5-years">More than 5 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="previous_address">Previous Address</Label>
                      <Textarea
                        id="previous_address"
                        value={formData.previous_address || ''}
                        onChange={(e) => setFormData({...formData, previous_address: e.target.value})}
                        placeholder="Enter your previous address (if applicable)"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="emergency_contact_name">Contact Name</Label>
                      <Input
                        id="emergency_contact_name"
                        value={formData.emergency_contact_name || ''}
                        onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
                        placeholder="Emergency contact name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                      <Input
                        id="emergency_contact_phone"
                        value={formData.emergency_contact_phone || ''}
                        onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})}
                        placeholder="Emergency contact phone"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergency_contact_relationship">Relationship</Label>
                      <Input
                        id="emergency_contact_relationship"
                        value={formData.emergency_contact_relationship || ''}
                        onChange={(e) => setFormData({...formData, emergency_contact_relationship: e.target.value})}
                        placeholder="e.g., Parent, Sibling"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="has_pets">Do you have pets?</Label>
                      <Switch
                        id="has_pets"
                        checked={formData.has_pets || false}
                        onCheckedChange={(checked) => setFormData({...formData, has_pets: checked})}
                      />
                    </div>
                    {formData.has_pets && (
                      <div className="md:col-span-2">
                        <Label htmlFor="pet_details">Pet Details</Label>
                        <Textarea
                          id="pet_details"
                          value={formData.pet_details || ''}
                          onChange={(e) => setFormData({...formData, pet_details: e.target.value})}
                          placeholder="Describe your pets (type, breed, age, etc.)"
                          rows={2}
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_smoker">Do you smoke?</Label>
                      <Switch
                        id="is_smoker"
                        checked={formData.is_smoker || false}
                        onCheckedChange={(checked) => setFormData({...formData, is_smoker: checked})}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employment Tab */}
          <TabsContent value="employment">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  Employment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="employment_status">Employment Status *</Label>
                    <Select 
                      value={formData.employment_status || ''} 
                      onValueChange={(value) => setFormData({...formData, employment_status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employed">Employed Full-time</SelectItem>
                        <SelectItem value="part-time">Employed Part-time</SelectItem>
                        <SelectItem value="self-employed">Self-employed</SelectItem>
                        <SelectItem value="contract">Contract Worker</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="annual_income">Annual Income (£) *</Label>
                    <Input
                      id="annual_income"
                      type="number"
                      value={formData.annual_income || ''}
                      onChange={(e) => setFormData({...formData, annual_income: parseFloat(e.target.value) || 0})}
                      placeholder="e.g. 35000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employer_name">Employer Name</Label>
                    <Input
                      id="employer_name"
                      value={formData.employer_name || ''}
                      onChange={(e) => setFormData({...formData, employer_name: e.target.value})}
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="job_title">Job Title</Label>
                    <Input
                      id="job_title"
                      value={formData.job_title || ''}
                      onChange={(e) => setFormData({...formData, job_title: e.target.value})}
                      placeholder="Your job title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employment_start_date">Employment Start Date</Label>
                    <Input
                      id="employment_start_date"
                      type="date"
                      value={formData.employment_start_date || ''}
                      onChange={(e) => setFormData({...formData, employment_start_date: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="employer_address">Employer Address</Label>
                  <Textarea
                    id="employer_address"
                    value={formData.employer_address || ''}
                    onChange={(e) => setFormData({...formData, employer_address: e.target.value})}
                    placeholder="Enter employer's full address"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="credit_score">Credit Score</Label>
                    <Input
                      id="credit_score"
                      type="number"
                      value={formData.credit_score || ''}
                      onChange={(e) => setFormData({...formData, credit_score: parseInt(e.target.value) || 0})}
                      placeholder="e.g. 750"
                      min="300"
                      max="850"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank_name">Bank Name *</Label>
                    <Input
                      id="bank_name"
                      value={formData.bank_name || ''}
                      onChange={(e) => setFormData({...formData, bank_name: e.target.value})}
                      placeholder="Your bank name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="account_holder_name">Account Holder Name *</Label>
                    <Input
                      id="account_holder_name"
                      value={formData.account_holder_name || ''}
                      onChange={(e) => setFormData({...formData, account_holder_name: e.target.value})}
                      placeholder="Name on bank account"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sort_code">Sort Code</Label>
                    <Input
                      id="sort_code"
                      value={formData.sort_code || ''}
                      onChange={(e) => setFormData({...formData, sort_code: e.target.value})}
                      placeholder="XX-XX-XX"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* References Tab */}
          <TabsContent value="references">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  References
                </CardTitle>
                <CardDescription>
                  Add references from previous landlords, employers, or character references
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {references.map((reference) => (
                    <div key={reference.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{reference.contact_name}</h4>
                          <p className="text-sm text-text-muted capitalize">
                            {reference.reference_type.replace('_', ' ')} Reference
                          </p>
                          {reference.company_name && (
                            <p className="text-sm text-text-muted">{reference.company_name}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-sm text-text-muted">
                            {reference.contact_email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {reference.contact_email}
                              </span>
                            )}
                            {reference.contact_phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {reference.contact_phone}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge className={getVerificationColor(reference.verification_status === 'verified')}>
                          {getVerificationIcon(reference.verification_status === 'verified')}
                          {reference.verification_status === 'verified' ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-dashed"
                    onClick={() => {
                      // Add reference form logic here
                      toast({
                        title: "Coming Soon",
                        description: "Reference management will be available soon."
                      })
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Reference
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={signOut}
            className="text-red-600 hover:text-red-700"
          >
            Sign Out
          </Button>
          <Button onClick={saveProfile} disabled={saving} size="lg">
            {saving ? <LoadingSpinner /> : 'Save Profile'}
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}

export default Profile
