import React from 'react'
import { Shield, Users, CheckCircle, Clock, FileText, Award } from 'lucide-react'

interface AuthBrandColumnProps {
  currentStep: number
  totalSteps: number
  mode: 'signin' | 'signup'
}

export const AuthBrandColumn: React.FC<AuthBrandColumnProps> = ({ currentStep, totalSteps, mode }) => {
  
  const getContextualContent = () => {
    if (mode === 'signin') {
      return {
        title: "Welcome back!",
        description: "Sign in to continue your rental journey with RapidRent.",
        features: [
          { icon: CheckCircle, text: "Access your applications" },
          { icon: Users, text: "Manage your properties" },
          { icon: Shield, text: "Secure account access" }
        ]
      }
    }

    switch (currentStep) {
      case 1:
        return {
          title: "Secure by design",
          description: "Your personal information is protected with bank-level security and never shared without your permission.",
          features: [
            { icon: Shield, text: "256-bit SSL encryption" },
            { icon: CheckCircle, text: "GDPR compliant" },
            { icon: Award, text: "ICO registered" }
          ]
        }
      case 2:
        return {
          title: "Tailored experience",
          description: "We customize RapidRent based on your role to show you the most relevant properties and features.",
          features: [
            { icon: Users, text: "Role-specific dashboard" },
            { icon: FileText, text: "Relevant documentation" },
            { icon: CheckCircle, text: "Streamlined applications" }
          ]
        }
      case 3:
        return {
          title: "Fast-track verification",
          description: "Upload your ID documents now to speed up future rental applications and unlock premium features.",
          features: [
            { icon: Clock, text: "60% faster applications" },
            { icon: Shield, text: "Right-to-Rent compliant" },
            { icon: Award, text: "AML guidance verified" }
          ]
        }
      default:
        return {
          title: "Join RapidRent",
          description: "The modern way to find and secure rental properties in the UK.",
          features: [
            { icon: CheckCircle, text: "Verified properties" },
            { icon: Users, text: "Trusted community" },
            { icon: Shield, text: "Secure platform" }
          ]
        }
    }
  }

  const content = getContextualContent()
  
  return (
    <div className="hidden lg:flex lg:flex-col lg:justify-center bg-gradient-to-br from-primary to-primary-dark p-12 text-white">
      <div className="max-w-md">
        {/* Brand Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">RapidRent</h1>
          <p className="text-lg text-primary-light">
            The modern way to find and secure rental properties
          </p>
        </div>
        
        {/* Progress Indicator - Only show for signup */}
        {mode === 'signup' && (
          <div className="mb-12">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
            </div>
            <div className="w-full bg-primary-dark rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Contextual Content */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {content.title}
            </h2>
            <p className="text-primary-light leading-relaxed">
              {content.description}
            </p>
          </div>
          
          <div className="space-y-4">
            {content.features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-light rounded-lg flex items-center justify-center mt-0.5">
                  <feature.icon className="w-4 h-4 text-primary-dark" />
                </div>
                <p className="text-primary-light">{feature.text}</p>
              </div>
            ))}
          </div>

          {/* Additional Context for Current Step */}
          {mode === 'signup' && currentStep === 3 && (
            <div className="mt-8 p-4 bg-primary-dark rounded-lg">
              <p className="text-sm text-primary-light">
                <strong className="text-white">Pro tip:</strong> Verified users receive priority on rental applications and access to exclusive properties.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}