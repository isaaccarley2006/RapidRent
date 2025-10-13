import React from "react";

import { AuthModeToggle } from "../AuthModeToggle";
import { StepNavigation } from "../StepNavigation";

import RegisterTenant from "@/components/auth/tenant/RegisterTenant";
import { LoginPage } from "@/components/auth/tenant/LoginPage";

interface TenantAuthFormProps {
  mode: "signin" | "signup";
  onToggleMode: () => void;
  currentStep: number;
  onStepChange: (step: number) => void;
}

export const TenantAuthForm: React.FC<TenantAuthFormProps> = ({
  mode,
  onToggleMode,
  currentStep,
  onStepChange,
}) => {
  const handlePrevStep = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8 text-center">
        <AuthModeToggle mode={mode} onToggle={onToggleMode} />
      </div>

      <StepNavigation
        currentStep={currentStep}
        totalSteps={mode == "signin" ? 1 : 2}
        onPrevStep={handlePrevStep}
        canGoBack={currentStep > 1}
      />

      <div className="space-y-6">
        {mode == "signin" ? (
          <LoginPage />
        ) : (
          <RegisterTenant
            onStepChange={onStepChange}
            currentStep={currentStep}
          />
        )}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={onToggleMode}
          className="text-sm text-text-muted hover:text-primary transition-colors"
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  );
};
