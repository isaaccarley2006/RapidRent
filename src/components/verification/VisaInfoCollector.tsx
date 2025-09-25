import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia',
  'Austria', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Belarus', 'Belgium', 'Belize', 'Benin',
  'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Chad', 'Chile',
  'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus',
  'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
  'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland',
  'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala',
  'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India',
  'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan',
  'Kazakhstan', 'Kenya', 'Kiribati', 'North Korea', 'South Korea', 'Kuwait', 'Kyrgyzstan',
  'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania',
  'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands',
  'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro',
  'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand',
  'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea',
  'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia',
  'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka',
  'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania',
  'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
  'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
  'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

const ukVisaTypes = [
  'British Citizen',
  'British National (Overseas)',
  'British Overseas Citizen',
  'British Protected Person',
  'British Subject',
  'Indefinite Leave to Remain (ILR)',
  'Pre-settled Status (EU Settlement Scheme)',
  'Settled Status (EU Settlement Scheme)',
  'Student Visa',
  'Graduate Visa',
  'Skilled Worker Visa',
  'Health and Care Worker Visa',
  'Intra-company Transfer Visa',
  'Global Talent Visa',
  'Start-up Visa',
  'Innovator Founder Visa',
  'Investor Visa (Tier 1)',
  'Family Visa',
  'Spouse/Partner Visa',
  'Fiance(e) Visa',
  'Parent Visa',
  'Child Visa',
  'Visit Visa',
  'Transit Visa',
  'Work Permit',
  'Ancestry Visa',
  'Youth Mobility Scheme',
  'Domestic Worker Visa',
  'Representative of Overseas Business',
  'Religious Worker Visa',
  'Sportsperson Visa',
  'Temporary Worker Visa',
  'Other'
];

interface VisaInfoCollectorProps {
  userId: string;
  onSave: () => void;
}

export const VisaInfoCollector: React.FC<VisaInfoCollectorProps> = ({ userId, onSave }) => {
  const [nationality, setNationality] = useState('');
  const [visaType, setVisaType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!nationality || !visaType) {
      toast({
        title: "Please complete both fields",
        description: "Both nationality and visa type are required for Right to Rent verification.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nationality,
          visa_type: visaType
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Information saved successfully",
        description: "Your nationality and visa information has been updated.",
      });

      onSave();
    } catch (error) {
      console.error('Error saving visa information:', error);
      toast({
        title: "Save failed",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Complete Your Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="text-blue-900 text-sm">
            We need your nationality and visa information to proceed with Right to Rent verification. 
            This information is required by UK law for all rental applications.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground font-medium">
              Nationality
            </Label>
            <Select onValueChange={setNationality} value={nationality}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select your nationality" />
              </SelectTrigger>
              <SelectContent className="max-h-48">
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-medium">
              UK Visa Type
            </Label>
            <Select onValueChange={setVisaType} value={visaType}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select your visa type" />
              </SelectTrigger>
              <SelectContent className="max-h-48">
                {ukVisaTypes.map((visa) => (
                  <SelectItem key={visa} value={visa}>
                    {visa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          className="w-full"
          disabled={isLoading || !nationality || !visaType}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Information
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};