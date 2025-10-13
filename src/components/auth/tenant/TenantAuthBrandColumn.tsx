import React from 'react'

interface TenantAuthBrandColumnProps {
  currentStep: number
  totalSteps: number
  mode: 'signin' | 'signup'
}

export const TenantAuthBrandColumn: React.FC<TenantAuthBrandColumnProps> = ({ 
  currentStep, 
  totalSteps, 
  mode 
}) => {
  const getStepContent = () => {
    if (mode === 'signin') {
      return {
        title: "Welcome back!",
        description: "Sign in to access your tenant profile and continue browsing properties.",
        features: [
          "Access your saved properties",
          "View your offer history", 
          "Manage your rental profile",
          "Connect with landlords"
        ]
      }
    }

    // Signup flow
    switch (currentStep) {
      case 1:
        return {
          title: "Join RapidRent as a Tenant",
          description: "Create your account to start your rental journey with verified listings and trusted landlords.",
          features: [
            "Browse verified properties",
            "Save your favorite listings",
            "Quick application process",
            "Direct landlord communication"
          ]
        }
      case 2:
        return {
          title: "Complete Your Profile",
          description: "Help us personalize your experience and make you more attractive to landlords.",
          features: [
            "Stand out to landlords",
            "Faster application process",
            "Personalized recommendations",
            "Build trust with verification"
          ]
        }
      default:
        return {
          title: "Join RapidRent",
          description: "Start your rental journey today.",
          features: []
        }
    }
  }

  const { title, description, features } = getStepContent()

  return (
    <div className="hidden lg:flex bg-gradient-to-br from-primary via-primary-glow to-primary-variant relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-glow/80 to-primary-variant/90" />
      
      <div className="relative z-10 flex flex-col justify-center p-12 text-white">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-4">RapidRent</h2>
          {mode === 'signup' && totalSteps > 1 && (
            <div className="flex items-center space-x-2 mb-6">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`h-2 w-12 rounded-full transition-all duration-300 ${
                    i + 1 <= currentStep ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-white/80">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold mb-3">{title}</h3>
            <p className="text-lg text-white/90 leading-relaxed">
              {description}
            </p>
          </div>
          
          {features.length > 0 && (
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span className="text-white/90">{feature}</span>
                </li>
              ))}
            </ul>
          )}
          
          {mode === 'signup' && currentStep === totalSteps && (
            <div className="mt-8 p-4 bg-white/10 rounded-lg border border-white/20">
              <p className="text-sm text-white/90">
                <strong>Pro tip:</strong> Complete your profile after signing up to get better matches and faster responses from landlords.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}