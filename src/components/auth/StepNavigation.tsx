import React from 'react'
import { ChevronLeft } from 'lucide-react'

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  onPrevStep: () => void
  canGoBack: boolean
}

const stepTitles = {
  1: 'Personal Details',
  2: 'Role & Identity', 
  3: 'Verification'
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevStep,
  canGoBack
}) => {
  return (
    <div className="space-y-6">
      {/* Step Progress Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step === currentStep
                    ? 'bg-primary text-white'
                    : step < currentStep
                    ? 'bg-primary-light text-primary'
                    : 'bg-muted text-text-muted'
                }`}
              >
                {step}
              </div>
              {step < totalSteps && (
                <div
                  className={`w-8 h-0.5 transition-colors ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        
        <span className="text-sm text-text-muted">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Step Title and Back Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            {stepTitles[currentStep as keyof typeof stepTitles]}
          </h2>
          <p className="text-sm text-text-muted mt-1">
            {currentStep === 1 && "Enter your basic information"}
            {currentStep === 2 && "Tell us about your role and identity"}
            {currentStep === 3 && "Verify your identity (optional)"}
          </p>
        </div>

        {canGoBack && (
          <button
            type="button"
            onClick={onPrevStep}
            className="flex items-center space-x-2 text-text-muted hover:text-text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </button>
        )}
      </div>
    </div>
  )
}