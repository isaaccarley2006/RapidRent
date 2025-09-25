import React from 'react'

interface AgentAuthBrandColumnProps {
  currentStep: number
  totalSteps: number
  mode: 'signin' | 'signup'
}

export const AgentAuthBrandColumn: React.FC<AgentAuthBrandColumnProps> = ({ 
  currentStep, 
  totalSteps, 
  mode 
}) => {
  const getStepContent = () => {
    if (mode === 'signin') {
      return {
        title: "Welcome back, Agent!",
        description: "Sign in to access your agent dashboard and manage your tenant relationships.",
        features: [
          "Access tenant profiles",
          "Manage property listings", 
          "View verification status",
          "Generate reference reports"
        ]
      }
    }

    // Signup flow
    switch (currentStep) {
      case 1:
        return {
          title: "Join RapidRent as an Agent",
          description: "Create your professional account to connect with verified tenants and manage properties efficiently.",
          features: [
            "Access verified tenant profiles",
            "Streamlined reference checking",
            "Professional dashboard",
            "Compliance management tools"
          ]
        }
      case 2:
        return {
          title: "Professional Information",
          description: "We need to verify your professional status and collect identity information for compliance.",
          features: [
            "Regulatory compliance",
            "Build tenant trust",
            "Professional verification",
            "Secure platform access"
          ]
        }
      case 3:
        return {
          title: "Identity Verification",
          description: "Complete your verification to access all agent features and ensure platform security.",
          features: [
            "Full platform access",
            "Enhanced security",
            "Tenant confidence",
            "Compliance assurance"
          ]
        }
      default:
        return {
          title: "Join RapidRent",
          description: "Start your professional journey today.",
          features: []
        }
    }
  }

  const { title, description, features } = getStepContent()

  return (
    <div className="hidden lg:flex bg-gradient-to-br from-accent via-accent-dark to-accent-variant relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/90 via-accent-dark/80 to-accent-variant/90" />
      
      <div className="relative z-10 flex flex-col justify-center p-12 text-white">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-4">RapidRent</h2>
          <div className="text-sm bg-white/20 px-3 py-1 rounded-full inline-block mb-4">
            Agent Portal
          </div>
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
                <strong>Pro tip:</strong> Complete verification to unlock all agent features and build trust with tenants on the platform.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}