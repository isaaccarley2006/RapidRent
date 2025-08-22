import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, ChevronLeft, ChevronRight, FileText, Shield, User, CreditCard, Users, Award } from 'lucide-react'
import { ReferenceCheckApplication, ReferenceCheckStep } from '@/types/referenceCheck'
import { IdentificationStep } from './steps/IdentificationStep'
import { EmploymentStep } from './steps/EmploymentStep'
import { LandlordStep } from './steps/LandlordStep'
import { FinancialStep } from './steps/FinancialStep'
import { GuarantorStep } from './steps/GuarantorStep'
import { ConsentStep } from './steps/ConsentStep'

interface ReferenceCheckModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const steps: Array<{
  key: ReferenceCheckStep
  title: string
  description: string
  icon: React.ReactNode
}> = [
  {
    key: 'identification',
    title: 'Identification',
    description: 'Upload valid ID and proof of address',
    icon: <Shield className="w-4 h-4" />
  },
  {
    key: 'employment',
    title: 'Employment & Income',
    description: 'Employer details and income verification',
    icon: <User className="w-4 h-4" />
  },
  {
    key: 'landlord',
    title: 'Previous Landlord',
    description: 'Previous rental history details',
    icon: <FileText className="w-4 h-4" />
  },
  {
    key: 'financial',
    title: 'Financial History',
    description: 'Credit check consent and disclosures',
    icon: <CreditCard className="w-4 h-4" />
  },
  {
    key: 'guarantor',
    title: 'Guarantor',
    description: 'Guarantor information (if required)',
    icon: <Users className="w-4 h-4" />
  },
  {
    key: 'consent',
    title: 'Consent & Declaration',
    description: 'Final consent and digital signature',
    icon: <Award className="w-4 h-4" />
  }
]

export const ReferenceCheckModal: React.FC<ReferenceCheckModalProps> = ({
  open,
  onOpenChange
}) => {
  const [currentStep, setCurrentStep] = useState<ReferenceCheckStep>('identification')
  const [formData, setFormData] = useState<ReferenceCheckApplication>({
    status: 'draft',
    credit_check_consent: false,
    has_ccj_iva_bankruptcy: false,
    has_guarantor: false,
    information_consent: false,
    contact_consent: false
  })
  const [completedSteps, setCompletedSteps] = useState<Set<ReferenceCheckStep>>(new Set())

  const currentStepIndex = steps.findIndex(step => step.key === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCompletedSteps(prev => new Set([...prev, currentStep]))
      setCurrentStep(steps[nextIndex].key)
    }
  }

  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key)
    }
  }

  const handleStepClick = (stepKey: ReferenceCheckStep) => {
    setCurrentStep(stepKey)
  }

  const updateFormData = (updates: Partial<ReferenceCheckApplication>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const isStepComplete = (stepKey: ReferenceCheckStep): boolean => {
    return completedSteps.has(stepKey)
  }

  const handleSubmit = async () => {
    // TODO: Submit to Supabase
    console.log('Submitting reference check application:', formData)
    onOpenChange(false)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'identification':
        return <IdentificationStep data={formData} updateData={updateFormData} />
      case 'employment':
        return <EmploymentStep data={formData} updateData={updateFormData} />
      case 'landlord':
        return <LandlordStep data={formData} updateData={updateFormData} />
      case 'financial':
        return <FinancialStep data={formData} updateData={updateFormData} />
      case 'guarantor':
        return <GuarantorStep data={formData} updateData={updateFormData} />
      case 'consent':
        return <ConsentStep data={formData} updateData={updateFormData} />
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="text-xl font-semibold">Complete Reference Check</DialogTitle>
          <div className="flex items-center gap-4 mt-2">
            <Progress value={progress} className="flex-1 h-2" />
            <span className="text-sm text-muted-foreground">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
        </DialogHeader>

        <div className="flex gap-6 h-[calc(90vh-200px)]">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0 border-r border-border pr-6">
            <div className="space-y-2">
              {steps.map((step, index) => {
                const isActive = step.key === currentStep
                const isComplete = isStepComplete(step.key)
                const isPast = index < currentStepIndex

                return (
                  <button
                    key={step.key}
                    onClick={() => handleStepClick(step.key)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 border border-primary/20' 
                        : isPast || isComplete
                        ? 'hover:bg-muted/50'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    disabled={!isPast && !isActive && !isComplete}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        isComplete
                          ? 'bg-green-100 text-green-600'
                          : isActive
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {isComplete ? <CheckCircle2 className="w-3 h-3" /> : step.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium text-sm ${
                            isActive ? 'text-primary' : isComplete ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {step.title}
                          </span>
                          {isComplete && (
                            <Badge variant="secondary" className="text-xs">
                              Complete
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-tight">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <Card className="border-0 shadow-none">
              <CardContent className="p-6">
                {renderStepContent()}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border pt-4 flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Save Draft
            </Button>
            {currentStepIndex === steps.length - 1 ? (
              <Button onClick={handleSubmit} className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Submit Application
              </Button>
            ) : (
              <Button onClick={handleNext} className="flex items-center gap-2">
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}