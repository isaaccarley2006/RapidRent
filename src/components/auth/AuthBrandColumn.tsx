import React from 'react'

interface AuthBrandColumnProps {
  currentStep: number
  totalSteps: number
  mode: 'signin' | 'signup'
}

export const AuthBrandColumn: React.FC<AuthBrandColumnProps> = ({ currentStep, totalSteps, mode }) => {
  return (
    <div className="hidden lg:flex lg:flex-col lg:justify-center bg-surface p-12 xl:p-16">
      {/* Brand Header */}
      <div className="mb-16">
        <h1 className="text-3xl font-bold text-text-primary mb-2">RapidRent</h1>
        <p className="text-lg text-text-muted">Your trusted rental platform</p>
      </div>

      {/* Progress Indicator - Only show for signup */}
      {mode === 'signup' && (
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <span className="text-sm font-medium text-text-muted">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-1">
            <div 
              className="bg-primary h-1 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Context Description */}
      <div className="space-y-6">
        {mode === 'signin' ? (
          <>
            <h2 className="text-2xl font-semibold text-text-primary">
              Welcome back
            </h2>
            <p className="text-text-muted leading-relaxed">
              Sign in to access your account and continue your rental journey.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-text-primary">
              Join our community
            </h2>
            <p className="text-text-muted leading-relaxed">
              We collect essential information to provide you with a secure and compliant rental experience.
            </p>
            <div className="space-y-3 text-sm text-text-muted">
              <p>• Personal details for account security</p>
              <p>• Role information for personalized features</p>
              <p>• Identity verification for trust and compliance</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}