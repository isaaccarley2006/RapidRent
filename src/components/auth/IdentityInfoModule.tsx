import React from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
]

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
]

interface IdentityInfoModuleProps {
  setValue: any
  errors: any
}

export const IdentityInfoModule: React.FC<IdentityInfoModuleProps> = ({ setValue, errors }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Identity Information
      </h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-text-primary font-medium">
            Nationality
          </Label>
          <Select onValueChange={(value) => setValue('nationality', value)}>
            <SelectTrigger className="h-12 border-muted focus:border-primary focus:ring-primary">
              <SelectValue placeholder="Select your nationality" />
            </SelectTrigger>
            <SelectContent className="bg-background border-muted max-h-48 z-50">
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.nationality && (
            <p className="text-sm text-destructive">{errors.nationality.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-text-primary font-medium">
            UK Visa Type
          </Label>
          <Select onValueChange={(value) => setValue('visaType', value)}>
            <SelectTrigger className="h-12 border-muted focus:border-primary focus:ring-primary">
              <SelectValue placeholder="Select your visa type" />
            </SelectTrigger>
            <SelectContent className="bg-background border-muted max-h-48 z-50">
              {ukVisaTypes.map((visaType) => (
                <SelectItem key={visaType} value={visaType}>
                  {visaType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.visaType && (
            <p className="text-sm text-destructive">{errors.visaType.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}