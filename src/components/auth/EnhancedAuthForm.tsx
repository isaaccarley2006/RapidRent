import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { FileUpload } from '@/components/auth/FileUpload'
import { OAuthButtons } from '@/components/auth/OAuthButtons'
import { TrustMarkers } from '@/components/auth/TrustMarkers'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { Shield, CheckCircle, CreditCard } from 'lucide-react'

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['tenant', 'agent', 'landlord'], {
    required_error: 'Please select your role',
  }),
  nationality: z.string().min(1, 'Please select your nationality'),
  visaType: z.string().min(1, 'Please select your visa type'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type SignUpFormData = z.infer<typeof signUpSchema>

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

interface EnhancedAuthFormProps {
  mode: 'signin' | 'signup'
  onToggleMode: () => void
}

export const EnhancedAuthForm: React.FC<EnhancedAuthFormProps> = ({ mode, onToggleMode }) => {
  const [loading, setLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const navigate = useNavigate()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true)
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            user_type: data.role,
            nationality: data.nationality,
            visa_type: data.visaType,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      })

      if (error) throw error

      if (authData.user) {
        // Create profile
        await supabase.from('profiles').upsert({
          id: authData.user.id,
          email: data.email,
          full_name: data.fullName,
          user_type: data.role,
          nationality: data.nationality,
          visa_type: data.visaType,
          profile_complete: false,
        })

        toast({
          title: "Account created successfully! 🎉",
          description: "Please check your email to verify your account.",
        })

        // Navigate based on role
        if (data.role === 'landlord') {
          navigate('/dashboard')
        } else if (data.role === 'tenant') {
          navigate('/profile')
        } else {
          navigate('/agent')
        }
      }
    } catch (error: any) {
      toast({
        title: "Account creation failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      toast({
        title: "Welcome back! 🎉",
        description: "You've been signed in successfully.",
      })

      navigate('/dashboard')
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (mode === 'signin') {
    return (
      <Card className="w-full max-w-md mx-auto bg-card border-muted shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-text-primary">
            Welcome back
          </CardTitle>
          <p className="text-text-muted">Sign in to your RapidRent account</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const email = formData.get('email') as string
            const password = formData.get('password') as string
            handleSignIn(email, password)
          }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-text-primary font-medium">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="h-12 border-muted focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-text-primary font-medium">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="h-12 border-muted focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <Separator className="bg-muted" />
          
          <OAuthButtons />

          <div className="text-center">
            <button
              type="button"
              onClick={onToggleMode}
              className="text-primary hover:text-primary-dark font-medium transition-colors"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-card border-muted shadow-lg">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-text-primary">
          Create your account
        </CardTitle>
        <p className="text-text-muted">Join RapidRent and find your perfect rental</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-text-primary font-medium">Full Name</Label>
            <Input
              id="fullName"
              {...register('fullName')}
              placeholder="Enter your full name"
              className="h-12 border-muted focus:border-primary focus:ring-primary"
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-text-primary font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Enter your email"
              className="h-12 border-muted focus:border-primary focus:ring-primary"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-text-primary font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              placeholder="Enter your password"
              className="h-12 border-muted focus:border-primary focus:ring-primary"
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-text-primary font-medium">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              placeholder="Confirm your password"
              className="h-12 border-muted focus:border-primary focus:ring-primary"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-text-primary font-medium">Role</Label>
            <Select onValueChange={(value) => setValue('role', value as any)}>
              <SelectTrigger className="h-12 border-muted focus:border-primary focus:ring-primary">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent className="bg-card border-muted">
                <SelectItem value="tenant">Tenant</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="landlord">Landlord</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-text-primary font-medium">Nationality</Label>
            <Select onValueChange={(value) => setValue('nationality', value)}>
              <SelectTrigger className="h-12 border-muted focus:border-primary focus:ring-primary">
                <SelectValue placeholder="Select your nationality" />
              </SelectTrigger>
              <SelectContent className="bg-card border-muted max-h-48">
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
            <Label className="text-text-primary font-medium">Visa Type</Label>
            <Select onValueChange={(value) => setValue('visaType', value)}>
              <SelectTrigger className="h-12 border-muted focus:border-primary focus:ring-primary">
                <SelectValue placeholder="Select your visa type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-muted max-h-48">
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

          <div className="pt-4 border-t border-muted">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-text-primary mb-2">Verify your ID</h3>
              <p className="text-sm text-text-muted mb-4">
                Compliant with UK Right-to-Rent and AML guidance.
              </p>
              <FileUpload onFilesChange={setUploadedFiles} />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create my account'}
          </Button>
        </form>

        <Separator className="bg-muted" />
        
        <OAuthButtons />

        <TrustMarkers />

        <div className="text-center">
          <button
            type="button"
            onClick={onToggleMode}
            className="text-primary hover:text-primary-dark font-medium transition-colors"
          >
            Already have an account? Sign in
          </button>
        </div>
      </CardContent>
    </Card>
  )
}