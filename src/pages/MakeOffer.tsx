import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, User, Calendar, Banknote, Shield, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { track } from '@/lib/analytics';
import { useUser } from '@/lib/auth/useUser';
interface Property {
  id: string;
  title: string;
  price: number | null;
  location: string | null;
}
interface TenantProfile {
  full_name: string | null;
  phone: string | null;
  employment_status: string | null;
  annual_income: number | null;
  current_rental_situation: string | null;
  has_pets: boolean | null;
  pet_details: string | null;
  is_smoker: boolean | null;
  tenant_references: string | null;
  additional_notes: string | null;
  employer_name: string | null;
  job_title: string | null;
  credit_score: number | null;
  bank_name: string | null;
  current_address: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  profile_completion_percentage: number | null;

  // Verification statuses
  identity_verified: boolean;
  employment_verified: boolean;
  income_verified: boolean;
  credit_verified: boolean;
  references_verified: boolean;
  bank_verified: boolean;
}
const MakeOffer: React.FC = () => {
  const {
    propertyId
  } = useParams<{
    propertyId: string;
  }>();
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const { user: authUser, profile: userProfile } = useUser();
  const [property, setProperty] = useState<Property | null>(null);
  const [tenantProfile, setTenantProfile] = useState<TenantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [offerPrice, setOfferPrice] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [message, setMessage] = useState('');

  // Profile form state
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [currentSituation, setCurrentSituation] = useState('');
  const [hasPets, setHasPets] = useState(false);
  const [petDetails, setPetDetails] = useState('');
  const [isSmoker, setIsSmoker] = useState(false);
  const [references, setReferences] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Check if user is a landlord and redirect
  useEffect(() => {
    if (userProfile?.role === 'landlord') {
      toast({
        title: "Access Denied",
        description: "Landlords cannot make offers. Only tenants can make offers on properties.",
        variant: "destructive"
      });
      navigate('/dashboard');
      return;
    }
  }, [userProfile, navigate, toast]);

  useEffect(() => {
    const fetchData = async () => {
      if (!propertyId || !user) return;
      try {
        // Fetch property details
        const {
          data: propertyData,
          error: propertyError
        } = await supabase.from('properties').select('id, title, price, location').eq('id', propertyId).single();
        if (propertyError) throw propertyError;
        setProperty(propertyData);

        // Fetch tenant profile
        const {
          data: profileData,
          error: profileError
        } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profileError && profileError.code !== 'PGRST116') throw profileError;
        if (profileData) {
          setTenantProfile(profileData as TenantProfile);
          setEmploymentStatus(profileData.employment_status || '');
          setAnnualIncome(profileData.annual_income?.toString() || '');
          setCurrentSituation(profileData.current_rental_situation || '');
          setHasPets(profileData.has_pets || false);
          setPetDetails(profileData.pet_details || '');
          setIsSmoker(profileData.is_smoker || false);
          setReferences(profileData.tenant_references || '');
          setAdditionalNotes(profileData.additional_notes || '');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error loading data",
          description: "Please try refreshing the page.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [propertyId, user, toast]);
  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !propertyId) return;
    setSubmitting(true);
    try {
      // First update tenant profile
      const {
        error: profileError
      } = await supabase.from('profiles').upsert({
        id: user.id,
        employment_status: employmentStatus,
        annual_income: annualIncome ? parseFloat(annualIncome) : null,
        current_rental_situation: currentSituation,
        has_pets: hasPets,
        pet_details: hasPets ? petDetails : null,
        is_smoker: isSmoker,
        tenant_references: references,
        additional_notes: additionalNotes,
        user_type: 'tenant'
      });
      if (profileError) throw profileError;

      // Submit the offer - provide both legacy and new columns for the sync trigger
      const {
        data: offerData,
        error: offerError
      } = await supabase.from('offers').insert({
        property_id: propertyId,
        listing_id: propertyId, // Sync trigger will ensure consistency
        tenant_id: user.id,
        renter_id: user.id, // Sync trigger will ensure consistency
        offer_price: parseFloat(offerPrice),
        preferred_move_in_date: moveInDate,
        tenant_message: message,
        status: 'pending'
      }).select().single();
      if (offerError) throw offerError;

      // Track successful offer submission
      track('offer_submitted', {
        listing_id: propertyId,
        offer_id: offerData?.id,
        user_id: authUser?.id,
        role: userProfile?.role
      });
      toast({
        title: "Offer submitted successfully!",
        description: "The landlord will review your offer and get back to you."
      });
      navigate(`/properties/${propertyId}`);
    } catch (error) {
      console.error('Error submitting offer:', error);
      toast({
        title: "Error submitting offer",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  const handleBackToProperty = () => {
    navigate(`/properties/${propertyId}`);
  };
  if (loading) {
    return <LoadingSpinner />;
  }
  if (!property) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Property not found</h2>
          <Button onClick={() => navigate('/listings')}>Back to Listings</Button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-text-primary">Make an Offer</h1>
          <p className="text-text-muted mt-2">Submit your application for {property.title}</p>
        </div>

        {/* Profile Completion Status */}
        {tenantProfile && tenantProfile.profile_completion_percentage !== null && tenantProfile.profile_completion_percentage < 80 && <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-800 mb-2">
                    Complete Your Profile for Better Applications
                  </h3>
                  <p className="text-yellow-700 mb-4">
                    Your profile is {tenantProfile.profile_completion_percentage}% complete. Complete your verified profile to make faster, more attractive offers to landlords.
                  </p>
                  <Button variant="outline" onClick={() => navigate('/profile')} className="border-yellow-300 text-yellow-800 hover:bg-yellow-100">
                    Complete Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>}

        {/* Verification Status */}
        {tenantProfile && <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Your Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[{
              key: 'identity',
              label: 'Identity',
              verified: tenantProfile.identity_verified
            }, {
              key: 'employment',
              label: 'Employment',
              verified: tenantProfile.employment_verified
            }, {
              key: 'income',
              label: 'Income',
              verified: tenantProfile.income_verified
            }, {
              key: 'credit',
              label: 'Credit Score',
              verified: tenantProfile.credit_verified
            }, {
              key: 'references',
              label: 'References',
              verified: tenantProfile.references_verified
            }, {
              key: 'bank',
              label: 'Bank Details',
              verified: tenantProfile.bank_verified
            }].map(item => <div key={item.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">{item.label}</span>
                    <Badge className={item.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {item.verified ? <Check className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                      {item.verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>)}
              </div>
            </CardContent>
          </Card>}

        <form onSubmit={handleSubmitOffer} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Offer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-primary" />
                  Offer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="offerPrice">Offer Price (£/month)</Label>
                  <Input id="offerPrice" type="number" value={offerPrice} onChange={e => setOfferPrice(e.target.value)} placeholder={property.price ? `Listed at £${property.price.toLocaleString()}` : 'Enter your offer'} required />
                </div>

                <div>
                  <Label htmlFor="moveInDate">Preferred Move-in Date</Label>
                  <Input id="moveInDate" type="date" value={moveInDate} onChange={e => setMoveInDate(e.target.value)} required />
                </div>

                <div>
                  <Label htmlFor="message">Message to Landlord</Label>
                  <Textarea id="message" value={message} onChange={e => setMessage(e.target.value)} placeholder="Tell the landlord why you're interested in this property..." rows={4} />
                </div>
              </CardContent>
            </Card>

            {/* Tenant Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="employmentStatus">Employment Status</Label>
                  <Select value={employmentStatus} onValueChange={setEmploymentStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employed">Employed Full-time</SelectItem>
                      <SelectItem value="self-employed">Self-employed</SelectItem>
                      <SelectItem value="contract">Contract Worker</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="annualIncome">Annual Income (£)</Label>
                  <Input id="annualIncome" type="number" value={annualIncome} onChange={e => setAnnualIncome(e.target.value)} placeholder="e.g. 35000" />
                </div>

                <div>
                  <Label htmlFor="currentSituation">Current Rental Situation</Label>
                  <Select value={currentSituation} onValueChange={setCurrentSituation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select current situation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first-time">First-time renter</SelectItem>
                      <SelectItem value="living-with-parents">Living with family</SelectItem>
                      <SelectItem value="current-tenant">Current tenant</SelectItem>
                      <SelectItem value="homeowner">Homeowner looking to rent</SelectItem>
                      <SelectItem value="student-accommodation">Student accommodation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="hasPets">Do you have pets?</Label>
                  <Switch id="hasPets" checked={hasPets} onCheckedChange={setHasPets} />
                </div>

                {hasPets && <div>
                    <Label htmlFor="petDetails">Pet Details</Label>
                    <Textarea id="petDetails" value={petDetails} onChange={e => setPetDetails(e.target.value)} placeholder="Describe your pets (type, breed, age, etc.)" rows={2} />
                  </div>}

                <div className="flex items-center justify-between">
                  <Label htmlFor="isSmoker">Do you smoke?</Label>
                  <Switch id="isSmoker" checked={isSmoker} onCheckedChange={setIsSmoker} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* References and Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>References & Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="references">References</Label>
                <Textarea id="references" value={references} onChange={e => setReferences(e.target.value)} placeholder="Provide contact details for previous landlords, employers, or character references..." rows={3} />
              </div>

              <div>
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea id="additionalNotes" value={additionalNotes} onChange={e => setAdditionalNotes(e.target.value)} placeholder="Any additional information you'd like the landlord to know..." rows={3} />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={handleBackToProperty}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? <LoadingSpinner /> : 'Submit Offer'}
            </Button>
          </div>
        </form>
      </div>
    </div>;
};
export default MakeOffer;